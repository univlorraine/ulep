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
  File,
  STORAGE_INTERFACE,
  StorageInterface,
} from '../../ports/storage.interface';

export class UploadMediaActivityCommand {
  activityId: string;
  file: File;
}

@Injectable()
export class UploadMediaActivityUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async execute(command: UploadMediaActivityCommand) {
    const activity = await this.tryToFindTheActivityOfId(command.activityId);

    const previousMedia = await this.tryToFindTheMediaOfActivity(activity);

    if (previousMedia) {
      await this.deletePreviousMedia(previousMedia);
    }

    const image = await this.upload(activity, command.file);

    const imageUrl = this.storageInterface.temporaryUrl(
      'activity',
      image.name,
      60 * 60 * 24 * 7,
    );

    return imageUrl;
  }

  private async tryToFindTheActivityOfId(id: string): Promise<Activity> {
    const instance = await this.activityRepository.ofId(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private tryToFindTheMediaOfActivity(
    activity: Activity,
  ): Promise<MediaObject | null> {
    return this.mediaObjectRepository.ressourceOfActivity(activity.id);
  }

  private async upload(
    activity: Activity,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const ressource = MediaObject.generate(file, 'activity');
    await this.storageInterface.write('activity', ressource.name, file);
    await this.mediaObjectRepository.saveRessourceOfActivity(
      activity,
      ressource,
    );

    return ressource;
  }

  private async deletePreviousMedia(ressource: MediaObject | null) {
    if (!ressource) return;
    await this.storageInterface.delete('activity', ressource.name);
    await this.mediaObjectRepository.remove(ressource.id);
  }
}
