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

export type UnsubscribeToEventCommand = {
  eventId: string;
  profilesIds: string[];
};

@Injectable()
export class UnsubscribeToEventUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: UnsubscribeToEventCommand) {
    const event = await this.assertEventExists(command.eventId);

    command.profilesIds.forEach(async (profileId) => {
      await this.assertProfileExists(profileId);
      await this.assertProfileIsSubscribedToEvent(event, profileId);
    });

    return this.eventRepository.unsubscribeToEvent({
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

  private async assertProfileExists(id: string) {
    const profile = await this.profileRepository.ofId(id);

    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }

    return profile;
  }

  private async assertProfileIsSubscribedToEvent(
    event: EventObject,
    profileId: string,
  ) {
    if (!event.subscribedProfiles.some((profile) => profile.id === profileId)) {
      throw new Error('Profile is not subscribed to event');
    }
  }
}
