import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NewProfileCreatedEvent } from './NewProfileCreatedEvent';
import { Logger } from '@nestjs/common';

@EventsHandler(NewProfileCreatedEvent)
export class NewProfileCreatedEventHandler
  implements IEventHandler<NewProfileCreatedEvent>
{
  private readonly logger = new Logger(NewProfileCreatedEventHandler.name);

  async handle(event: NewProfileCreatedEvent): Promise<void> {
    this.logger.debug(`New profile created: ${event.profile.id}`);
  }
}
