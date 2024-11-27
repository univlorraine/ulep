import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';
import {
  StorageInterface,
  STORAGE_INTERFACE,
} from 'src/core/ports/storage.interface';

@Injectable()
export class GetEventUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
  ) {}

  async execute(id: string) {
    const instance = await this.eventRepository.ofId(id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    const imageURL = instance.image
      ? await this.storage.temporaryUrl(
          instance.image.bucket,
          instance.image.name,
          60 * 60 * 24,
        )
      : undefined;

    instance.imageURL = imageURL;

    return instance;
  }
}
