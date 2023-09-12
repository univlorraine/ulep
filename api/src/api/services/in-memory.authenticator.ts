import { KeycloakUser } from '@app/keycloak';
import { AuthenticatorInterface } from './authenticator.interface';

export class InMemoryAuthenticator implements AuthenticatorInterface {
  constructor(readonly user: KeycloakUser) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  authenticate(token: string): Promise<KeycloakUser> {
    return Promise.resolve(this.user);
  }
}
