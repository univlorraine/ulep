import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Profile } from 'src/core/models';
import { User } from 'src/core/models/user.model';
import { EmailGateway, EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  NotificationGateway,
  NOTIFICATION_GATEWAY,
} from 'src/core/ports/notification.gateway';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  UniversityRepository,
  UNIVERSITY_REPOSITORY,
} from 'src/core/ports/university.repository';
import {
  UserRepository,
  USER_REPOSITORY,
} from 'src/core/ports/user.repository';
import { CreateOrUpdateLogEntryUsecase } from 'src/core/usecases/log-entry';

export type SendMessageNotificationCommand = {
  senderId: string;
  content: string;
  usersId: string[];
};

@Injectable()
export class SendMessageNotificationUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(NOTIFICATION_GATEWAY)
    private readonly notificationGateway: NotificationGateway,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    @Inject(CreateOrUpdateLogEntryUsecase)
    private readonly createOrUpdateLogEntryUsecase: CreateOrUpdateLogEntryUsecase,
    private readonly keycloakService: KeycloakClient,
  ) {}

  async execute(command: SendMessageNotificationCommand): Promise<void> {
    let sender: User | UserRepresentation = await this.userRepository.ofId(
      command.senderId,
    );
    if (!sender) {
      const keycloakUser = await this.keycloakService.getUserById(
        command.senderId,
      );
      if (!keycloakUser) {
        throw new RessourceDoesNotExist('Sender not found');
      }
      sender = keycloakUser;
    }

    const firstname =
      sender instanceof User ? sender.firstname : sender.firstName;
    const lastname = sender instanceof User ? sender.lastname : sender.lastName;

    const profiles = [];
    for (const userId of command.usersId) {
      const profile = await this.profileRepository.ofUser(userId);
      if (profile !== null && profile.user.acceptsEmail) {
        profiles.push(profile);
        await this.sendEmail(
          profile.user.email,
          profile.nativeLanguage.code,
          command.content,
          {
            firstname: profile.user.firstname,
            lastname: profile.user.lastname,
          },
          { firstname, lastname },
        );
      } else {
        const keycloakUser = await this.keycloakService.getUserById(userId);
        if (
          keycloakUser &&
          (keycloakUser.attributes?.['languageId'] ||
            keycloakUser.attributes?.['universityId'])
        ) {
          const language = await this.languageRepository.ofId(
            keycloakUser.attributes['languageId'][0],
          );
          const university = await this.universityRepository.ofId(
            keycloakUser.attributes['universityId'][0],
          );
          await this.sendEmail(
            keycloakUser.email,
            language.code || university.nativeLanguage.code,
            command.content,
            {
              firstname: keycloakUser.firstName,
              lastname: keycloakUser.lastName,
            },
            { firstname, lastname },
          );
        }
      }
    }

    this.sendPushNotificationToUsers(
      profiles,
      firstname,
      lastname,
      command.content,
    );
  }

  private async sendPushNotificationToUsers(
    profiles: Profile[],
    firstname: string,
    lastname: string,
    content: string,
  ) {
    const notifications = profiles
      .map((profile) => {
        if (profile.user.devices && profile.user.devices.length > 0) {
          return profile.user.devices.map((device) => {
            return {
              token: device.token,
              language: profile.nativeLanguage.code,
            };
          });
        } else {
          return [];
        }
      })
      .flat();

    this.notificationGateway.sendMessageNotification({
      to: notifications,
      content,
      sender: {
        firstname,
        lastname,
      },
    });
  }

  private async sendEmail(
    email: string,
    language: string,
    content: string,
    user: { firstname: string; lastname: string },
    sender: { firstname: string; lastname: string },
  ) {
    await this.emailGateway.sendNewMessageEmail({
      to: email,
      language,
      content,
      user,
      sender,
    });
  }
}
