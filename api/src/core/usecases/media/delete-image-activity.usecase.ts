import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { MediaObject } from 'src/core/models';
import { Activity } from 'src/core/models/activity.model';
import {
  ACTIVITY_REPOSITORY,
  ActivityRepository,
} from '../../ports/activity.repository';
import {
  MEDIA_OBJECT_REPOSITORY,
  MediaObjectRepository,
} from '../../ports/media-object.repository';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class DeleteImageActivityCommand {
  activityId: string;
}

@Injectable()
export class DeleteImageActivityUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async execute(command: DeleteImageActivityCommand) {
    const activity = await this.tryToFindTheActivityOfId(command.activityId);

    if (activity.image) {
      await this.deletePreviousAvatar(activity.image);
    }
  }

  private async tryToFindTheActivityOfId(id: string): Promise<Activity> {
    const instance = await this.activityRepository.ofId(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private async deletePreviousAvatar(image: MediaObject | null) {
    if (!image) return;
    await this.storageInterface.delete('activity', image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
