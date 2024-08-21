import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Profile } from 'src/core/models';
import { User } from 'src/core/models/user.model';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  NOTIFICATION_GATEWAY,
  NotificationGateway,
} from 'src/core/ports/notification.gateway';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';

export type SendMessageNotificationCommand = {
  senderId: string;
  content: string;
  usersId: string[];
};

@Injectable()
export class SendMessageNotificationUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(NOTIFICATION_GATEWAY)
    private readonly notificationGateway: NotificationGateway,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
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

    const profilePromises = command.usersId.map((userId) =>
      this.profileRepository.ofUser(userId),
    );
    const profiles = (await Promise.all(profilePromises)).filter(
      (profile) => profile !== null && profile.user.acceptsEmail,
    );

    const firstname =
      sender instanceof User ? sender.firstname : sender.firstName;
    const lastname = sender instanceof User ? sender.lastname : sender.lastName;

    this.sendEmailToUsers(profiles, firstname, lastname, command.content);
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

  private async sendEmailToUsers(
    profiles: Profile[],
    firstname: string,
    lastname: string,
    content: string,
  ) {
    for (const profile of profiles) {
      if (profile.user.email) {
        await this.emailGateway.sendNewMessageEmail({
          to: profile.user.email,
          language: profile.nativeLanguage.code,
          content,
          user: {
            firstname: profile.user.firstname,
            lastname: profile.user.lastname,
          },
          sender: { firstname, lastname },
        });
      }
    }
  }
}
