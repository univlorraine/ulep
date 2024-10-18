import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { EventObject } from 'src/core/models/event.model';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';
import {
  UserRepository,
  USER_REPOSITORY,
} from 'src/core/ports/user.repository';

export type SubscribeToEventCommand = {
  eventId: string;
  usersIds: string[];
};

@Injectable()
export class SubscribeToEventUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: SubscribeToEventCommand) {
    const event = await this.assertEventExists(command.eventId);
    await this.assertEventAcceptsSubscriptions(event);

    command.usersIds.forEach(async (userId) => {
      await this.assertUserExists(userId);
      await this.assertUserIsNotAlreadySubscribedToEvent(event, userId);
    });

    return this.eventRepository.subscribeToEvent({
      eventId: command.eventId,
      usersIds: command.usersIds,
    });
  }

  private async assertEventExists(id: string) {
    const event = await this.eventRepository.ofId(id);

    if (!event) {
      throw new RessourceDoesNotExist('Event does not exist');
    }

    return event;
  }

  private async assertEventAcceptsSubscriptions(event: EventObject) {
    if (event.withSubscription === false) {
      throw new Error('Event does not accept subscriptions');
    }

    return event;
  }

  private async assertUserExists(id: string) {
    const user = await this.userRepository.ofId(id);

    if (!user) {
      throw new RessourceDoesNotExist('User does not exist');
    }

    return user;
  }

  private async assertUserIsNotAlreadySubscribedToEvent(
    event: EventObject,
    userId: string,
  ) {
    if (event.enrolledUsers.some((user) => user.id === userId)) {
      throw new Error('User is already subscribed to event');
    }
  }
}
