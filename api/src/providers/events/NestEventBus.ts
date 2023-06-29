import { Injectable } from '@nestjs/common';
import * as Nest from '@nestjs/cqrs';
import { EventBus } from 'src/core/events/event-bus';

@Injectable()
export class NestEventBus implements EventBus {
  constructor(private readonly eventBus: Nest.EventBus) {}

  publish(event: Event) {
    return this.eventBus.publish(event);
  }
}
