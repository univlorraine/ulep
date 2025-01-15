import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { EventStatus, EventType } from 'src/core/models/event.model';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';

export type GetEventsAdminCommand = {
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
  orderBy?: {
    field: string;
    order: string;
  };
};

@Injectable()
export class GetEventsAdminUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(command: GetEventsAdminCommand) {
    const formattedField = _.snakeCase(command.orderBy?.field);

    return this.eventRepository.findAll({
      ...command,
      orderBy: command.orderBy
        ? {
            field: formattedField,
            order: command.orderBy?.order,
          }
        : undefined,
    });
  }
}
