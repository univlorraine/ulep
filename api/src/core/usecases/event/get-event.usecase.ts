import { Inject, Injectable } from '@nestjs/common';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';

@Injectable()
export class GetEventUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(id: string) {
    return this.eventRepository.ofId(id);
  }
}
