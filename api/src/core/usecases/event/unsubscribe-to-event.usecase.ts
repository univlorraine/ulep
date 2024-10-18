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

export type UnsubscribeToEventCommand = {
  eventId: string;
  usersIds: string[];
};

@Injectable()
export class UnsubscribeToEventUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UnsubscribeToEventCommand) {
    const event = await this.assertEventExists(command.eventId);

    command.usersIds.forEach(async (userId) => {
      await this.assertUserExists(userId);
      await this.assertUserIsSubscribedToEvent(event, userId);
    });

    return this.eventRepository.unsubscribeToEvent({
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

  private async assertUserExists(id: string) {
    const user = await this.userRepository.ofId(id);

    if (!user) {
      throw new RessourceDoesNotExist('User does not exist');
    }

    return user;
  }

  private async assertUserIsSubscribedToEvent(
    event: EventObject,
    userId: string,
  ) {
    if (!event.enrolledUsers.some((user) => user.id === userId)) {
      throw new Error('User is not subscribed to event');
    }
  }
}
