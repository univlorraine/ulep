/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { KeycloakUser } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
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

    const userPartner = learningLanguagePartner.profile.user;

    const language = learningLanguagePartner.profile.nativeLanguage.code;

    const devices = userPartner.devices.map((device) => ({
      token: device.token,
      language,
    }));

    await this.notificationGateway.sendSessionCreatedNotification({
      to: devices,
      session: {
        date: new Intl.DateTimeFormat(language, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: userPartner.university.timezone,
        }).format(session.startAt),
        hour: new Intl.DateTimeFormat(language, {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: userPartner.university.timezone,
        }).format(session.startAt),
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
        date: new Intl.DateTimeFormat(language, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: userPartner.university.timezone,
        }).format(session.startAt),
        hour: new Intl.DateTimeFormat(language, {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: userPartner.university.timezone,
        }).format(session.startAt),
        partnerName: learningLanguageUser.profile.user.firstname,
        comment: session.comment,
      },
    });
  }
}
