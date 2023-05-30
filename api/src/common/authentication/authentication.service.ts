import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  AUTHENTICATION_STRATEGY_TOKEN,
  AuthenticationStrategy,
} from './authentication.strategy';

export class AuthenticationError extends Error {}

@Injectable()
export class AuthenticationService {
  private logger = new Logger(AuthenticationService.name);

  constructor(
    @Inject(AUTHENTICATION_STRATEGY_TOKEN)
    private readonly strategy: AuthenticationStrategy,
  ) {}

  async authenticate(accessToken: string): Promise<string> {
    try {
      const userInfos = await this.strategy.authenticate(accessToken);

      const user = {
        id: userInfos.sub,
        username: userInfos.preferred_username,
      };

      // TODO: create user if it doesn't exist
      return user.id;
    } catch (e) {
      this.logger.error(e.message, e.stackTrace);
      throw new AuthenticationError(e.message);
    }
  }
}
