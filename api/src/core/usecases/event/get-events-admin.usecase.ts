import { Inject, Injectable } from '@nestjs/common';
import { EventStatus, EventType } from 'src/core/models/event.model';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';

export type GetEventsCommand = {
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    title?: string;
    authorUniversityId?: string;
    concernedUniversitiesIds?: string[];
    status?: EventStatus;
    types?: EventType[];
    languageCode: string;
  };
};

@Injectable()
export class GetEventsAdminUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(command: GetEventsCommand) {
    return this.eventRepository.findAll(command);
  }
}
