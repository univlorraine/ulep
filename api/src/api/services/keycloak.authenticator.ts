import { Injectable } from '@nestjs/common';
import { KeycloakClient, KeycloakUser } from '@app/keycloak';
import { AuthenticatorInterface } from './authenticator.interface';

@Injectable()
export class KeycloakAuthenticator implements AuthenticatorInterface {
  constructor(private readonly keycloak: KeycloakClient) {}

  async authenticate(token: string): Promise<KeycloakUser> {
    const userInfo = await this.keycloak.authenticate(token);

    return userInfo;
  }
}
