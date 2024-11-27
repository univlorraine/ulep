import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';

export class ResetPasswordCommand {
  email: string;
  loginUrl: string;
}

@Injectable()
export class ResetPasswordUsecase {
  private readonly logger = new Logger(ResetPasswordUsecase.name);

  constructor(
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    private readonly keycloakClient: KeycloakClient,
    private readonly env: ConfigService<Env, true>,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const user = await this.keycloakClient.getUserByEmail(command.email);

    if (!user) {
      return;
    }

    const userIsAdmin = await this.keycloakClient.isAdmin(user);
    if (userIsAdmin) {
      return;
    }

    const credentials = await this.keycloakClient.getUserCredentials(user.id);

    const hasPasswordCredentials = credentials.some(
      (credential) => credential.type === 'password',
    );

    const language = await this.getUserLanguage(user.id);

    if (hasPasswordCredentials) {
      await this.sendResetPasswordEmail(user, command.loginUrl, language);
    } else {
      await this.sendPasswordChangeDeniedEmail(user, language);
    }
  }

  private async sendResetPasswordEmail(
    user: UserRepresentation,
    loginUrl: string,
    language: string,
  ): Promise<void> {
    try {
      await this.keycloakClient.executeActionEmail(
        ['UPDATE_PASSWORD'],
        user.id,
        language,
        loginUrl,
      );
    } catch (error) {
      this.logger.error('Error while sending ResetPasswordEmail', error);
    }
  }

  private async sendPasswordChangeDeniedEmail(
    user: UserRepresentation,
    language: string,
  ): Promise<void> {
    try {
      await this.emailGateway.sendPasswordChangeDeniedEmail({
        to: user.email,
        language,
        user: {
          firstname: user.firstName,
          lastname: user.lastName,
        },
      });
    } catch (error) {
      this.logger.error('Error while sending PasswordChangeDeniedEmail', error);
    }
  }

  private async getUserLanguage(user: string): Promise<string> {
    const profile = await this.profileRepository.ofUser(user);

    const language = profile
      ? profile.nativeLanguage.code
      : this.env.get('DEFAULT_TRANSLATION_LANGUAGE');

    return language;
  }
}
