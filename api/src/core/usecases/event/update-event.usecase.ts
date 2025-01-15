import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { EventTranslation, EventType } from 'src/core/models/event.model';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  UniversityRepository,
  UNIVERSITY_REPOSITORY,
} from 'src/core/ports/university.repository';

export type UpdateEventCommand = {
  id: string;
  title: string;
  content: string;
  translations?: EventTranslation[];
  languageCode: string;
  status?: string;
  type: EventType;
  imageCredit?: string;
  eventUrl?: string;
  address?: string;
  addressName?: string;
  withSubscription: boolean;
  concernedUniversities: string[];
  diffusionLanguages: string[];
  startDate: Date;
  endDate: Date;
};

@Injectable()
export class UpdateEventUsecase {
  #googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query='; // TODO: move to config ?

  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: UpdateEventCommand) {
    await this.assertEventExists(command.id);
    await this.assertLanguageExists(command.languageCode);

    let addressUrl = undefined;
    if (command.address) {
      addressUrl = new URL(command.address, this.#googleMapsUrl).toString();
    }

    return this.eventRepository.update({
      id: command.id,
      title: command.title,
      content: command.content,
      languageCode: command.languageCode,
      translations: command.translations ?? [],
      status: command.status,
      startDate: command.startDate,
      endDate: command.endDate,
      type: command.type,
      imageCredit: command.imageCredit,
      eventURL: command.eventUrl,
      address: command.address,
      addressName: command.addressName,
      deepLink: addressUrl,
      withSubscription: command.withSubscription,
      concernedUniversities: command.concernedUniversities,
      diffusionLanguages: command.diffusionLanguages,
    });
  }

  private async assertEventExists(id: string) {
    const event = await this.eventRepository.ofId(id);

    if (!event) {
      throw new RessourceDoesNotExist('Event does not exist');
    }

    return event;
  }

  private async assertLanguageExists(code: string) {
    const language = await this.languageRepository.ofCode(code.toLowerCase());

    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }
}
