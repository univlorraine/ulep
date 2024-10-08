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

export class CreateSessionCommand {
  user: KeycloakUser;
  tandemId: string;
  startAt: Date;
  comment?: string;
}

@Injectable()
export class CreateSessionUsecase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(NOTIFICATION_GATEWAY)
    private readonly notificationGateway: NotificationGateway,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
  ) {}

  async execute(command: CreateSessionCommand) {
    await this.assertTandemExist(command.tandemId);

    const session = await this.sessionRepository.create({
      tandemId: command.tandemId,
      startAt: command.startAt,
      comment: command.comment,
    });

    await this.sendSessionCreatedNotification(command.user, session);

    return session;
  }

  private async assertTandemExist(id: string) {
    const tandem = await this.tandemRepository.ofId(id);

    if (!tandem) {
      throw new RessourceDoesNotExist('Tandem does not exist');
    }
  }

  private async sendSessionCreatedNotification(
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

    console.log({ user, learningLanguagePartner, learningLanguageUser });

    const userPartner = learningLanguagePartner.profile.user;

    const language = learningLanguagePartner.profile.nativeLanguage.code;

    const devices = userPartner.devices.map((device) => ({
      token: device.token,
      language,
    }));

    await this.notificationGateway.sendSessionCreatedNotification({
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

    await this.emailGateway.sendSessionCreatedEmail({
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
