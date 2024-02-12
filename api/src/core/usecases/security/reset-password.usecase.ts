import { Inject, Injectable, Logger } from '@nestjs/common';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import { KeycloakClient, UserRepresentation } from '@app/keycloak';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';

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

    const credentials = await this.keycloakClient.getUserCredentials(user.id);

    const hasPasswordCredentials = credentials.some(
      (credential) => credential.type === 'password',
    );

    if (hasPasswordCredentials) {
      await this.sendResetPasswordEmail(user, command.loginUrl);
    } else {
      await this.sendPasswordChangeDeniedEmail(user);
    }
  }

  private async sendResetPasswordEmail(
    user: UserRepresentation,
    loginUrl: string,
  ): Promise<void> {
    try {
      const language = await this.getUserLanguage(user.id);

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
  ): Promise<void> {
    try {
      const language = await this.getUserLanguage(user.id);

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
