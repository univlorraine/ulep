import { Inject, Injectable } from '@nestjs/common';
import { Tandem, TandemStatus } from 'src/core/models';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  EMAIL_GATEWAY,
  EmailGateway,
  TandemPausedUnpausedFunction,
} from 'src/core/ports/email.gateway';
import {
  NOTIFICATION_GATEWAY,
  NotificationFunction,
  NotificationGateway,
} from 'src/core/ports/notification.gateway';

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
      this.sendNotifications(
        tandem,
        this.notificationGateway.sendPausedTandemNotification,
      );
      this.sendEmail(
        tandem,
        this.emailGateway.sendTandemPausedEmail,
        this.emailGateway.sendAdminTandemPausedEmail,
      );
    }

    if (command.status === 'ACTIVE' && tandem.status === 'PAUSED') {
      this.sendNotifications(
        tandem,
        this.notificationGateway.sendUnpausedTandemNotification,
      );
      this.sendEmail(
        tandem,
        this.emailGateway.sendTandemUnpausedEmail,
        this.emailGateway.sendAdminTandemUnpausedEmail,
      );
    }
  }

  private sendNotifications(
    tandem: Tandem,
    notificationFunction: NotificationFunction,
  ) {
    const notifications = tandem.learningLanguages
      .map((language) => {
        return language.profile.user.devices.map((device) => {
          return {
            token: device.token,
            language: language.profile.nativeLanguage.code,
          };
        });
      })
      .flat();

    notificationFunction({ to: notifications });
  }

  private sendEmail(
    tandem,
    sendEmailFunction: TandemPausedUnpausedFunction,
    sendAdminEmailFunction: TandemPausedUnpausedFunction,
  ) {
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

    sendEmailFunction({
      to: profileA.user.email,
      language: profileA.nativeLanguage.code,
      ...payloadA,
    });

    sendEmailFunction({
      to: profileB.user.email,
      language: profileB.nativeLanguage.code,
      ...payloadB,
    });

    const universityA = profileA.user.university;
    const universityB = profileB.user.university;
    if (universityA.notificationEmail) {
      sendAdminEmailFunction({
        to: universityA.notificationEmail,
        language: universityA.nativeLanguage.code,
        ...payloadA,
      });
    }

    if (universityB.notificationEmail) {
      sendAdminEmailFunction({
        to: universityB.notificationEmail,
        language: universityB.nativeLanguage.code,
        ...payloadB,
      });
    }
  }
}
