import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedOperation } from 'src/core/errors';
import { MediaObject } from 'src/core/models';
import { EventObject } from 'src/core/models/event.model';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';
import {
  MediaObjectRepository,
  MEDIA_OBJECT_REPOSITORY,
} from 'src/core/ports/media-object.repository';
import {
  File,
  StorageInterface,
  STORAGE_INTERFACE,
} from '../../ports/storage.interface';

export class UploadEventImageCommand {
  id: string;
  file: File;
}

@Injectable()
export class UploadEventImageUsecase {
  constructor(
    @Inject(STORAGE_INTERFACE)
    private readonly storageInterface: StorageInterface,
    @Inject(MEDIA_OBJECT_REPOSITORY)
    private readonly mediaObjectRepository: MediaObjectRepository,
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(command: UploadEventImageCommand) {
    const event = await this.tryToFindEvent(command.id);
    const previousImage = await this.tryToFindTheImageOfEvent(event);
    if (event) {
      await this.deletePreviousEventImage(previousImage);
    }

    const image = await this.upload(event, command.file);

    const url = this.storageInterface.temporaryUrl(
      image.bucket,
      image.name,
      60 * 60 * 24,
    );

    return url;
  }

  private async tryToFindEvent(id: string): Promise<EventObject> {
    const instance = await this.eventRepository.ofId(id);
    if (!instance) {
      throw new UnauthorizedOperation();
    }

    return instance;
  }

  private tryToFindTheImageOfEvent(
    event: EventObject,
  ): Promise<MediaObject | null> {
    return this.mediaObjectRepository.findOne(
      `${event.authorUniversity.id}/${event.id}`,
    );
  }

  private async upload(
    event: EventObject,
    file: Express.Multer.File,
  ): Promise<MediaObject> {
    const image = MediaObject.generate(
      file,
      'event',
      `${event.authorUniversity.id}/${event.id}`,
    );

    await this.storageInterface.write(image.bucket, image.name, file);
    await this.mediaObjectRepository.saveEventImage(event, image);

    return image;
  }

  private async deletePreviousEventImage(image: MediaObject | null) {
    if (!image) return;
    await this.storageInterface.delete(image.bucket, image.name);
    await this.mediaObjectRepository.remove(image.id);
  }
}
