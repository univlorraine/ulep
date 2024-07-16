import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Tandem, TandemStatus, User, UserStatus } from 'src/core/models';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TANDEM_HISTORY_REPOSITORY,
  TandemHistoryRepository,
} from 'src/core/ports/tandem-history.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';
import { ChatService } from 'src/providers/services/chat.service';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';

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
        id: user.id,
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

        await this.tandemRepository.update(
          new Tandem({ ...tandem, status: TandemStatus.INACTIVE }),
        );

        if (tandem.status === TandemStatus.ACTIVE) {
          await this.sendTandemCancelledEmails(tandem);
        }
      }
    }
  }

  private async findUserTandems(user: string): Promise<Tandem[]> {
    const profile = await this.profileRepository.ofUser(user);
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
      await this.chatService.createConversation([newContactId, user.id]);
      if (user.contactId) {
        await this.chatService.deleteConversationByContactId(user.contactId);
      }
    }
  }
}
