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

export type CreateEventCommand = {
  title: string;
  content: string;
  authorUniversityId: string;
  translations?: EventTranslation[];
  languageCode: string;
  status?: string;
  type: EventType;
  eventUrl?: string;
  imageCredit?: string;
  address?: string;
  addressName?: string;
  withSubscription: boolean;
  concernedUniversities?: string[];
  diffusionLanguages: string[];
  startDate: Date;
  endDate: Date;
};

@Injectable()
export class CreateEventUsecase {
  #googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query='; // TODO: move to config ?

  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: CreateEventCommand) {
    await this.assertLanguageExists(command.languageCode);
    await this.assertUniversityExists(command.authorUniversityId);

    let addressUrl = undefined;
    if (command.address) {
      addressUrl = new URL(command.address, this.#googleMapsUrl).toString();
    }

    return this.eventRepository.create({
      title: command.title,
      content: command.content,
      languageCode: command.languageCode,
      translations: command.translations ?? [],
      authorUniversityId: command.authorUniversityId,
      status: command.status,
      startDate: command.startDate,
      endDate: command.endDate,
      type: command.type,
      eventURL: command.eventUrl,
      imageCredit: command.imageCredit,
      address: command.address,
      addressName: command.addressName,
      deepLink: addressUrl,
      withSubscription: command.withSubscription,
      concernedUniversities: command.concernedUniversities,
      diffusionLanguages: command.diffusionLanguages,
    });
  }

  private async assertUniversityExists(id: string) {
    const university = await this.universityRepository.ofId(id);

    if (!university) {
      throw new RessourceDoesNotExist('University does not exist');
    }

    return university;
  }

  private async assertLanguageExists(code: string) {
    const language = await this.languageRepository.ofCode(code.toLowerCase());

    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }
}
