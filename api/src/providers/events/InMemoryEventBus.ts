import { DomainEvent, EventBus } from '../../core/events/event-bus';

export class InMemoryEventBus implements EventBus {
  #events: DomainEvent[] = [];

  get event(): DomainEvent[] {
    return this.#events;
  }

  reset(): void {
    this.#events = [];
  }

  async publish(event: DomainEvent): Promise<void> {
    this.#events.push(event);
  }
}
