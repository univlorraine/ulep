import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { MediaObject } from 'src/core/models';
import { Activity } from 'src/core/models/activity.model';
import {
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from '../../ports/activity.repository';
import {
  MediaObjectRepository,
  MEDIA_OBJECT_REPOSITORY,
} from '../../ports/media-object.repository';
import {
  File,
  StorageInterface,
  STORAGE_INTERFACE,
} from '../../ports/storage.interface';

export class UploadImageActivityCommand {
  activityId: string;
  file: File;
}

@Injectable()
export class UploadImageActivityUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
  ) {}

  async execute(command: UploadImageActivityCommand) {
    const activity = await this.tryToFindTheActivityOfId(command.activityId);

    const previousImage = await this.tryToFindTheImageOfActivity(activity);

    if (previousImage) {
      await this.deletePreviousActivityImage(previousImage);
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

  private tryToFindTheImageOfActivity(
    activity: Activity,
  ): Promise<MediaObject | null> {
    if (activity.image) {
      return this.mediaObjectRepository.findOne(activity.image.id);
    }

    return null;
  }

  private async upload(
    activity: Activity,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const image = MediaObject.generate(file, 'activity', activity.id);
    await this.storageInterface.write('activity', image.name, file);
    await this.mediaObjectRepository.saveImageOfActivity(activity, image);

    return image;
  }

  private async deletePreviousActivityImage(image: MediaObject | null) {
    if (!image) return;
    await this.storageInterface.delete('activity', image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
