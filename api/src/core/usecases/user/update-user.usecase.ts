import { Inject, Injectable, Logger } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../ports/user.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  Tandem,
  TandemStatus,
  University,
  User,
  UserStatus,
} from 'src/core/models';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { KeycloakClient } from '@app/keycloak';

export class UpdateUserCommand {
  status?: UserStatus;
  acceptsEmail?: boolean;
  email?: string;
  firstname?: string;
  lastname?: string;
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
    private readonly env: ConfigService<Env, true>,
    private readonly keycloakClient: KeycloakClient,
  ) {}

  async execute(id: string, command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.ofId(id);
    if (!user) {
      throw new RessourceDoesNotExist();
    }

    if (command.firstname || command.lastname || command.email) {
      await this.keycloakClient.updateUser({
        id: user.id,
        firstname: command.firstname || user.firstname,
        lastname: command.lastname || user.lastname,
        email: command.email || user.email,
      });
    }

    const update = await this.userRepository.update(
      new User({
        ...user,
        status: command.status || user.status,
        acceptsEmail: command.acceptsEmail || user.acceptsEmail,
        firstname: command.firstname || user.firstname,
        lastname: command.lastname || user.lastname,
        email: command.email || user.email,
      }),
    );

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
    const universities = new Set<University>();
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

      if (universities.has(profile.user.university)) {
        continue;
      }

      if (profile.user.university.notificationEmail) {
        try {
          await this.emailGateway.sendTandemCanceledNoticeEmail({
            to: profile.user.university.notificationEmail,
            language: profile.user.university.country.code.toLowerCase(),
            user: { ...profile.user, university: profile.user.university.name },
            partner: { ...partner, university: partner.university.name },
          });
        } catch (error) {
          this.logger.error(
            `Error sending email to university ${profile.user.university.id} after tandem cancel: ${error}`,
          );
        }
      }

      universities.add(profile.user.university);
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
}
