import { Injectable, UnauthorizedException } from '@nestjs/common';
import { KeycloakClient, KeycloakUser } from '@app/keycloak';
import { AuthenticatorInterface } from './authenticator.interface';

@Injectable()
export class KeycloakAuthenticator implements AuthenticatorInterface {
  constructor(private readonly keycloak: KeycloakClient) {}

  async authenticate(token: string): Promise<KeycloakUser> {
    const userInfo = await this.keycloak.authenticate(token);
    const sessions = await this.keycloak.getUserSessions(userInfo.sub);

    if (sessions.length === 0) {
      throw new UnauthorizedException();
    }

    return userInfo;
  }
}
