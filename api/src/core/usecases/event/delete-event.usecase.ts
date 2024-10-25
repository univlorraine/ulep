import { KeycloakClient } from '@app/keycloak';
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

type GenericEmailContact = {
  name: string;
  email: string;
  language: string;
};

const isPropValuesEqual = (subject, target, propNames) =>
  propNames.every((propName) => subject[propName] === target[propName]);

const getUniqueItemsByProperties = (items, propNames) =>
  items.filter(
    (item, index, array) =>
      index ===
      array.findIndex((foundItem) =>
        isPropValuesEqual(foundItem, item, propNames),
      ),
  );
@Injectable()
export class DeleteEventUsecase {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    @Inject(KeycloakClient)
    private readonly keycloakClient: KeycloakClient,
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

      // Notification emails are sent to universities
      const universitiesNotificationEmails: GenericEmailContact[] = [];
      profiles.items.forEach((profile) => {
        if (profile.user.university.notificationEmail) {
          universitiesNotificationEmails.push({
            name: profile.user.university.name,
            email: profile.user.university.notificationEmail,
            language: profile.user.university.nativeLanguage.code,
          });
        }
      });

      const sentNotificationsEmails = new Set<string>();
      await Promise.all(
        universitiesNotificationEmails.map(async (university) => {
          if (sentNotificationsEmails.has(university.email)) {
            return;
          }

          this.emailGateway.sendEventDeletedEmail({
            to: university.email,
            language: university.language,
            event: {
              title: event.title,
              authorUniversity: event.authorUniversity.name,
              date: event.startDate.toLocaleDateString(),
            },
          });

          sentNotificationsEmails.add(university.email);
        }),
      );

      // Notification emails are sent to universities default contacts
      const universitiesDefaultContacts: GenericEmailContact[] = [];
      await Promise.all(
        profiles.items.map(async (profile) => {
          if (profile.user.university.defaultContactId) {
            const keycloakData = await this.keycloakClient.getUserById(
              profile.user.university.defaultContactId,
            );
            universitiesDefaultContacts.push({
              name: keycloakData.firstName + ' ' + keycloakData.lastName,
              email: keycloakData.email,
              language: profile.user.university.nativeLanguage.code,
            });
          }
        }),
      );

      const sentDefaultContactsEmails = new Set<string>();
      await Promise.all(
        universitiesDefaultContacts.map(async (contact) => {
          if (sentDefaultContactsEmails.has(contact.email)) {
            return;
          }

          this.emailGateway.sendEventDeletedEmail({
            to: contact.email,
            language: contact.language,
            event: {
              title: event.title,
              authorUniversity: event.authorUniversity.name,
              date: event.startDate.toLocaleDateString(),
            },
          });

          sentDefaultContactsEmails.add(contact.email);
        }),
      );
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
