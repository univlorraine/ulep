import { KeycloakConfiguration } from '@app/keycloak';

export type Configuration = {
  port: number;
  keycloak: KeycloakConfiguration;
  adminRole: string;
  defaultTranslation: string;
};

export const configuration = (): Configuration => ({
  port: 3000,
  keycloak: {
    baseUrl: process.env.KEYCLOAK_BASE_URL,
    realm: process.env.KEYCLOAK_REALM,
    username: process.env.KEYCLOAK_ADMIN,
    password: process.env.KEYCLOAK_ADMIN_PASSWORD,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  },
  adminRole: process.env.ADMIN_ROLE || 'admin',
  defaultTranslation: process.env.DEFAULT_TRADUCTION || 'fr',
});
