import { KeycloakUser } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { formatInTimeZone } from 'date-fns-tz';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Session } from 'src/core/models/session.model';
import { EmailGateway, EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import {
  NotificationGateway,
  NOTIFICATION_GATEWAY,
} from 'src/core/ports/notification.gateway';
import {
  SessionRepository,
  SESSION_REPOSITORY,
} from 'src/core/ports/session.repository';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from 'src/core/ports/tandem.repository';

export class CancelSessionCommand {
  user: KeycloakUser;
  sessionId: string;
  comment?: string;
}

@Injectable()
export class CancelSessionUsecase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @Inject(NOTIFICATION_GATEWAY)
    private readonly notificationGateway: NotificationGateway,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
  ) {}

  async execute(command: CancelSessionCommand) {
    await this.assertSessionExist(command.sessionId);

    const session = await this.sessionRepository.cancel(
      command.sessionId,
      command.comment,
    );

    await this.sendSessionCanceldNotification(command.user, session);

    return session;
  }

  private async assertSessionExist(id: string) {
    const session = await this.sessionRepository.ofId(id);

    if (!session) {
      throw new RessourceDoesNotExist('Session does not exist');
    }
  }

  private async sendSessionCanceldNotification(
    user: KeycloakUser,
    session: Session,
  ) {
    const tandem = await this.tandemRepository.ofId(session.tandemId);

    const learningLanguagePartner = tandem.learningLanguages.find(
      (learningLanguage) => learningLanguage.profile.user.id !== user.sub,
    );

    const learningLanguageUser = tandem.learningLanguages.find(
      (learningLanguage) => learningLanguage.profile.user.id === user.sub,
    );

    const userPartner = learningLanguagePartner.profile.user;

    const language = learningLanguagePartner.profile.nativeLanguage.code;

    const devices = userPartner.devices.map((device) => ({
      token: device.token,
      language,
    }));

    await this.notificationGateway.sendSessionCanceledNotification({
      to: devices,
      session: {
        date: formatInTimeZone(
          session.startAt,
          userPartner.university.timezone,
          'dd/MM/yyyy',
        ),
        hour: formatInTimeZone(
          session.startAt,
          userPartner.university.timezone,
          'HH:mm',
        ),
        partnerName: learningLanguageUser.profile.user.firstname,
      },
    });

    await this.emailGateway.sendSessionCanceledEmail({
      to: userPartner.email,
      language,
      user: {
        firstname: userPartner.firstname,
        lastname: userPartner.lastname,
      },
      session: {
        date: formatInTimeZone(
          session.startAt,
          userPartner.university.timezone,
          'dd/MM/yyyy',
        ),
        hour: formatInTimeZone(
          session.startAt,
          userPartner.university.timezone,
          'HH:mm',
        ),
        partnerName: learningLanguageUser.profile.user.firstname,
        comment: session.comment,
      },
    });
  }
}
