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
  ) {}

  async execute(command: SendMessageNotificationCommand): Promise<void> {
    const sender = await this.userRepository.ofId(command.senderId);
    if (!sender) {
      throw new RessourceDoesNotExist('Sender not found');
    }

    const profilePromises = command.usersId.map((userId) =>
      this.profileRepository.ofUser(userId),
    );
    const profiles = (await Promise.all(profilePromises)).filter(
      (user) => user !== null,
    );

    this.sendEmailToUsers(profiles, sender, command.content);
    this.sendPushNotificationToUsers(profiles, sender, command.content);
  }

  private async sendPushNotificationToUsers(
    profiles: Profile[],
    sender: User,
    content,
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
        firstname: sender.firstname,
        lastname: sender.lastname,
      },
    });
  }

  private async sendEmailToUsers(
    profiles: Profile[],
    sender: User,
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
          sender: { firstname: sender.firstname, lastname: sender.lastname },
        });
      }
    }
  }
}
