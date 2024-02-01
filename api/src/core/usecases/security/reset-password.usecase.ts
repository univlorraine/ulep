import { Inject, Injectable, Logger } from '@nestjs/common';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  EMAIL_TEMPLATE_REPOSITORY,
  EmailTemplateRepository,
} from 'src/core/ports/email-template.repository';
import { EMAIL_TEMPLATE_IDS } from 'src/core/models/email-content.model';
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
    @Inject(EMAIL_TEMPLATE_REPOSITORY)
    private readonly emailTemplateRepository: EmailTemplateRepository,
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

    const hasCredentials = credentials.some(
      (credential) => credential.type === 'password',
    );

    if (hasCredentials) {
      await this.keycloakClient.executeActionEmail(
        ['UPDATE_PASSWORD'],
        user.id,
        command.loginUrl,
      );
    } else {
      this.sendSSOResetPasswordEmail(user, command.loginUrl);
    }
  }

  private async sendSSOResetPasswordEmail(
    user: UserRepresentation,
    loginUrl: string,
  ): Promise<void> {
    try {
      const profile = await this.profileRepository.ofUser(user.id);
      const language = profile
        ? profile.nativeLanguage.code
        : this.env.get('DEFAULT_TRANSLATION_LANGUAGE');
      const email = await this.emailTemplateRepository.getEmail(
        EMAIL_TEMPLATE_IDS.RESET_PASSWORD_SSO,
        language,
        {
          firstname: user.firstName,
          loginUrl,
        },
      );

      await this.emailGateway.send({
        recipient: user.email,
        email,
      });
    } catch (error) {
      this.logger.error('Error while sending SSO reset password email', error);
    }
  }
}
