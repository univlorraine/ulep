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
