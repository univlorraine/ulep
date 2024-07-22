import { KeycloakClient } from '@app/keycloak';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';

export class LogoutAllSessionsCommand {
  login: string;
  token: string;
}

@Injectable()
export class LogoutAllSessionsUsecase {
  private readonly logger = new Logger(LogoutAllSessionsUsecase.name);

  constructor(
    private readonly keycloakClient: KeycloakClient,
    private readonly env: ConfigService<Env, true>,
  ) {}

  async execute(command: LogoutAllSessionsCommand): Promise<boolean> {
    try {
      const token = this.env.get('WEB_SERVICE_LOGOUT_TOKEN');

      if (token !== command.token) return false;

      const user = await this.keycloakClient.getUserByUniversityLogin(
        command.login,
      );

      if (!user) return false;

      await this.keycloakClient.logoutUser(user.id);

      return true;
    } catch (error) {
      this.logger.error(error);

      return false;
    }
  }
}
