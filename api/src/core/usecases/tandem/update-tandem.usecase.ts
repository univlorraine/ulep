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
