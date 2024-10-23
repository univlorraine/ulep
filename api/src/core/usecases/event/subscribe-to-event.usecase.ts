import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { EventObject } from 'src/core/models/event.model';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';

export type SubscribeToEventCommand = {
  eventId: string;
  profilesIds: string[];
};

@Injectable()
export class SubscribeToEventUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: SubscribeToEventCommand) {
    const event = await this.assertEventExists(command.eventId);
    await this.assertEventAcceptsSubscriptions(event);

    command.profilesIds.forEach(async (profileId) => {
      await this.assertProfileExists(profileId);
      await this.assertProfileIsNotAlreadySubscribedToEvent(event, profileId);
    });

    return this.eventRepository.subscribeToEvent({
      eventId: command.eventId,
      profilesIds: command.profilesIds,
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

  private async assertProfileExists(id: string) {
    const profile = await this.profileRepository.ofId(id);

    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }

    return profile;
  }

  private async assertProfileIsNotAlreadySubscribedToEvent(
    event: EventObject,
    profileId: string,
  ) {
    if (event.subscribedProfiles.some((profile) => profile.id === profileId)) {
      throw new Error('Profile is already subscribed to event');
    }
  }
}
