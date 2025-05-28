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

import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Tandem, TandemStatus, User, UserStatus } from 'src/core/models';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import {
  CommunityChatRepository,
  COMMUNITY_CHAT_REPOSITORY,
} from 'src/core/ports/community-chat.repository';
import { EmailGateway, EMAIL_GATEWAY } from 'src/core/ports/email.gateway';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  TandemHistoryRepository,
  TANDEM_HISTORY_REPOSITORY,
} from 'src/core/ports/tandem-history.repository';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from 'src/core/ports/tandem.repository';
import { ChatService } from 'src/providers/services/chat.service';
import { UserRepository, USER_REPOSITORY } from '../../ports/user.repository';

export class UpdateUserCommand {
  status?: UserStatus;
  acceptsEmail?: boolean;
  email?: string;
  firstname?: string;
  lastname?: string;
  contactId?: string;
}

@Injectable()
export class UpdateUserUsecase {
  private readonly logger = new Logger(UpdateUserUsecase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    @Inject(TANDEM_HISTORY_REPOSITORY)
    private readonly tandemHistoryRepository: TandemHistoryRepository,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
    @Inject(COMMUNITY_CHAT_REPOSITORY)
    private readonly communityChatRepository: CommunityChatRepository,
    private readonly env: ConfigService<Env, true>,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(id: string, command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.ofId(id);
    if (!user) {
      throw new RessourceDoesNotExist();
    }

    if (
      command.firstname !== user.firstname ||
      command.lastname !== user.lastname ||
      command.email !== user.email
    ) {
      await this.keycloakClient.updateUser({
        id: user.contactId,
        firstname: command.firstname || user.firstname,
        lastname: command.lastname || user.lastname,
        email: command.email || user.email,
      });
    }

    if (command.contactId) {
      const keycloakUser = await this.keycloakClient.getUserById(
        command.contactId,
      );
      if (!keycloakUser) {
        throw new RessourceDoesNotExist('Contact does not exist');
      }
    }

    const { user: update, newContactId } = await this.userRepository.update(
      new User({
        ...user,
        ...command,
      }),
    );

    // Create a conversation with the new contact and delete the old one
    await this.handleConversation(user, newContactId);

    if (command.email !== user.email) {
      await this.tandemHistoryRepository.update(user.id, command.email);
    }

    if (
      command.status === UserStatus.CANCELED &&
      user.status !== UserStatus.CANCELED
    ) {
      await this.cancelTandemsForUser(user);
    }

    if (
      command.status === UserStatus.BANNED &&
      user.status !== UserStatus.BANNED
    ) {
      await this.cancelTandemsForUser(user);
      await this.keycloakClient.logoutUser(user.id);

      if (user.acceptsEmail) {
        await this.sendAccountBlockedEmail(user);
      }
    }

    return update;
  }

  private async cancelTandemsForUser(user: User) {
    const tandems = await this.findUserTandems(user.id);
    if (tandems.length > 0) {
      for (const tandem of tandems) {
        if (tandem.status === TandemStatus.INACTIVE) {
          continue;
        }
        if (tandem.status === TandemStatus.DRAFT) {
          await this.tandemRepository.delete(tandem.id);
          continue;
        }

        await this.tandemRepository.update(
          new Tandem({ ...tandem, status: TandemStatus.INACTIVE }),
        );

        await this.deleteConversation(tandem);

        if (tandem.status === TandemStatus.ACTIVE) {
          await this.sendTandemCancelledEmails(tandem);
        }
      }
    }
  }

  private async findUserTandems(userId: string): Promise<Tandem[]> {
    const profile = await this.profileRepository.ofUser(userId);
    if (!profile) {
      return [];
    }

    return this.tandemRepository.getTandemsForProfile(profile.id);
  }

  private async sendTandemCancelledEmails(tandem: Tandem) {
    const universityIds = new Set<string>();
    const profiles = tandem.learningLanguages.map(
      (language) => language.profile,
    );

    for (const profile of profiles) {
      const partner = profiles.find((p) => p.id !== profile.id).user;

      if (profile.user.acceptsEmail) {
        try {
          await this.emailGateway.sendTandemCanceledEmail({
            to: profile.user.email,
            language: profile.nativeLanguage.code,
            user: { ...profile.user, university: profile.user.university.name },
            partner: { ...partner, university: partner.university.name },
          });
        } catch (error) {
          this.logger.error(
            `Error sending email to user ${profile.user.id} after tandem cancel: ${error}`,
          );
        }
      }

      if (!universityIds.has(profile.user.university.id)) {
        if (profile.user.university.notificationEmail) {
          try {
            await this.emailGateway.sendTandemCanceledNoticeEmail({
              to: profile.user.university.notificationEmail,
              language: profile.user.university.country.code.toLowerCase(),
              user: {
                ...profile.user,
                university: profile.user.university.name,
              },
              partner: { ...partner, university: partner.university.name },
            });
          } catch (error) {
            this.logger.error(
              `Error sending email to university ${profile.user.university.id} after tandem cancel: ${error}`,
            );
          }
        }
        universityIds.add(profile.user.university.id);
      }
    }
  }

  private async sendAccountBlockedEmail(user: User) {
    let language = this.env.get('DEFAULT_TRANSLATION_LANGUAGE');
    const profile = await this.profileRepository.ofUser(user.id);
    if (profile) {
      language = profile.nativeLanguage.code;
    }

    try {
      await this.emailGateway.sendAccountBlockedEmail({
        to: user.email,
        language: language,
        user: { ...user },
      });
    } catch (error) {
      this.logger.error(
        `Error sending email to user ${user.id} after ban: ${error}`,
      );
    }
  }

  private async handleConversation(user: User, newContactId: string) {
    if (newContactId !== user.contactId) {
      if (user.contactId) {
        const chatToIgnore = await this.findUserTandems(user.id);

        const communityChats = await this.communityChatRepository.all();

        await this.chatService.deleteConversationByUserId(user.id, [
          ...chatToIgnore.map((chat) => chat.id),
          ...communityChats.map((chat) => chat.id),
        ]);
      }
      await this.chatService.createConversation([newContactId, user.id]);
    }
  }

  private async deleteConversation(tandem: Tandem) {
    await this.chatService.deleteConversation(tandem.id);
  }
}
