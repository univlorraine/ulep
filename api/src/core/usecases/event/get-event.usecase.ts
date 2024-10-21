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
import { GetMediaObjectUsecase } from '../media';

@Injectable()
export class GetEventUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    private readonly getMediaObjectUsecase: GetMediaObjectUsecase,
  ) {}

  async execute(id: string) {
    const instance = await this.eventRepository.ofId(id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    const mediaObject = await this.getMediaObjectUsecase.execute({
      id: `${instance.authorUniversity.id}/${instance.id}`,
    });
    const imageURL = mediaObject
      ? await this.storage.temporaryUrl(
          mediaObject.bucket,
          mediaObject.name,
          60 * 60 * 24,
        )
      : undefined;

    return { ...instance, imageURL };
  }
}
