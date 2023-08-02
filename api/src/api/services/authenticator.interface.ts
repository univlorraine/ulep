import { KeycloakUser } from '@app/keycloak';

export const AUTHENTICATOR = 'AuthenticatorInterface';

export interface AuthenticatorInterface {
  authenticate(token: string): Promise<KeycloakUser | null>;
}
