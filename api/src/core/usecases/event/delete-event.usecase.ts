import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { EmailGateway, EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import {
  EventRepository,
  EVENT_REPOSITORY,
} from 'src/core/ports/event.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';

@Injectable()
export class DeleteEventUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
  ) {}

  async execute(id: string) {
    const event = await this.assertEventExists(id);

    if (event.withSubscription) {
      const profiles = await this.profileRepository.findAll(
        undefined,
        undefined,
        undefined,
        {
          subscribedToEvent: id,
        },
      );

      /*       const universityDefaultsContacts = new Set<string>();
      profiles.items.forEach((profile) => {
        universityDefaultsContacts.add(
          profile.user.university.notificationEmail,
        ); // university.defaultContactId ?
      });

      const universityContacts = await Promise.all(
        Array.from(universityDefaultsContacts).map(async (contact) => {
          // ?
        }),
      ); */

      await Promise.all(
        profiles.items.map(async (profile) => {
          this.emailGateway.sendEventDeletedEmail({
            to: profile.user.email,
            language: profile.nativeLanguage.code,
            user: profile.user,
            event: {
              title: event.title,
              authorUniversity: event.authorUniversity.name,
              date: event.startDate.toLocaleDateString(),
            },
          });
        }),
      );

      /*       await Promise.all(
        Array.from(universityContacts).map(async (contact) => {
          this.emailGateway.sendEventDeletedEmail({
            to: contact,
            language: 'en',
            user: {
              email: contact,
            },
            event: {
              title: event.title,
              date: event.startDate.toLocaleDateString(),
            },
          });
        }),
      ); */
    }

    return this.eventRepository.delete(id);
  }

  private async assertEventExists(id: string) {
    const event = await this.eventRepository.ofId(id);

    if (!event) {
      throw new RessourceDoesNotExist('Event does not exist');
    }

    return event;
  }
}
