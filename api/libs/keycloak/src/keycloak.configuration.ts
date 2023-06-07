export const KEYCLOAK_CONFIGURATION = 'KEYCLOAK_CONFIGURATION';

export interface KeycloakConfiguration {
  baseUrl: string;
  realm: string;
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
}
