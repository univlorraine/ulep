import { Credentials, KeycloakClient } from '@app/keycloak';
import { Injectable } from '@nestjs/common';

export class RefreshTokenCommand {
  token: string;
}

@Injectable()
export class RefreshTokensUsecase {
  constructor(private readonly keycloak: KeycloakClient) {}

  async execute(command: RefreshTokenCommand): Promise<Credentials> {
    const { token } = command;

    const credentials = await this.keycloak.refreshToken(token);

    return credentials;
  }
}
