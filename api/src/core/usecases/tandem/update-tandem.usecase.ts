import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Tandem, TandemStatus } from 'src/core/models';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  NOTIFICATION_GATEWAY,
  NotificationGateway,
} from 'src/core/ports/notification.gateway';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';

export class UpdateTandemCommand {
  id: string;
  status: TandemStatus;
}

@Injectable()
export class UpdateTandemUsecase {
  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemRepository,
    @Inject(NOTIFICATION_GATEWAY)
    private readonly notificationGateway: NotificationGateway,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
  ) {}

  async execute(command: UpdateTandemCommand): Promise<void> {
    const tandem = await this.tandemsRepository.ofId(command.id);

    if (!tandem) {
      throw new RessourceDoesNotExist();
    }

    await this.tandemsRepository.update(
      new Tandem({
        ...tandem,
        status: command.status,
      }),
    );

    if (command.status === 'PAUSED' && tandem.status === 'ACTIVE') {
      this.sendNotifications(tandem, true);
      this.sendEmail(tandem, true);
    }

    if (command.status === 'ACTIVE' && tandem.status === 'PAUSED') {
      this.sendNotifications(tandem, false);
      this.sendEmail(tandem, false);
    }
  }

  private sendNotifications(tandem: Tandem, paused: boolean) {
    const notifications = tandem.learningLanguages
      .map((language) => {
        return language.profile.user.acceptsEmail
          ? language.profile.user.devices.map((device) => {
              return {
                token: device.token,
                language: language.profile.nativeLanguage.code,
              };
            })
          : [];
      })
      .flat();

    if (paused) {
      return this.notificationGateway.sendPausedTandemNotification({
        to: notifications,
      });
    }

    return this.notificationGateway.sendUnpausedTandemNotification({
      to: notifications,
    });
  }

  private sendEmail(tandem, paused: boolean) {
    const profileA = tandem.learningLanguages[0].profile;
    const profileB = tandem.learningLanguages[1].profile;
    const payloadA = {
      user: {
        firstname: profileA.user.firstname,
        lastname: profileA.user.lastname,
        university: profileA.user.university.name,
      },
      partner: {
        firstname: profileB.user.firstname,
        lastname: profileB.user.lastname,
        university: profileB.user.university.name,
      },
    };
    const payloadB = {
      user: {
        firstname: profileB.user.firstname,
        lastname: profileB.user.lastname,
        university: profileB.user.university.name,
      },
      partner: {
        firstname: profileA.user.firstname,
        lastname: profileA.user.lastname,
        university: profileA.user.university.name,
      },
    };

    if (paused) {
      if (profileA.user.acceptsEmail) {
        this.emailGateway.sendTandemPausedEmail({
          to: profileA.user.email,
          language: profileA.nativeLanguage.code,
          ...payloadA,
        });
      }

      if (profileB.user.acceptsEmail) {
        this.emailGateway.sendTandemPausedEmail({
          to: profileB.user.email,
          language: profileB.nativeLanguage.code,
          ...payloadB,
        });
      }
    } else {
      if (profileA.user.acceptsEmail) {
        this.emailGateway.sendTandemUnpausedEmail({
          to: profileA.user.email,
          language: profileA.nativeLanguage.code,
          ...payloadA,
        });
      }

      if (profileB.user.acceptsEmail) {
        this.emailGateway.sendTandemUnpausedEmail({
          to: profileB.user.email,
          language: profileB.nativeLanguage.code,
          ...payloadB,
        });
      }
    }

    const universityA = profileA.user.university;
    const universityB = profileB.user.university;
    if (paused) {
      if (universityA.notificationEmail) {
        this.emailGateway.sendAdminTandemPausedEmail({
          to: universityA.notificationEmail,
          language: universityA.nativeLanguage.code,
          ...payloadA,
        });
      }

      if (
        universityB.notificationEmail &&
        universityB.notificationEmail !== universityA.notificationEmail
      ) {
        this.emailGateway.sendAdminTandemPausedEmail({
          to: universityB.notificationEmail,
          language: universityB.nativeLanguage.code,
          ...payloadB,
        });
      }
    } else {
      if (universityA.notificationEmail) {
        this.emailGateway.sendAdminTandemUnpausedEmail({
          to: universityA.notificationEmail,
          language: universityA.nativeLanguage.code,
          ...payloadA,
        });
      }

      if (
        universityB.notificationEmail &&
        universityB.notificationEmail !== universityA.notificationEmail
      ) {
        this.emailGateway.sendAdminTandemUnpausedEmail({
          to: universityB.notificationEmail,
          language: universityB.nativeLanguage.code,
          ...payloadB,
        });
      }
    }
  }
}
