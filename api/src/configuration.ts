import { KeycloakConfiguration } from '@app/keycloak';

interface SmtpConfiguration {
  host: string;
  port: number;
  secure: boolean;
  sender: string;
}

export type Configuration = {
  port: number;
  keycloak: KeycloakConfiguration;
  adminRole: string;
  defaultTranslationLanguage: string;
  CANCEL_TRESHOLD_IN_MIN: number;
  smtp: SmtpConfiguration;
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
  defaultTranslationLanguage: process.env.DEFAULT_TRANSLATION_LANGUAGE || 'fr',
  CANCEL_TRESHOLD_IN_MIN:
    parseInt(process.env.CANCEL_TRESHOLD_IN_MIN, 10) || 15,
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 25,
    secure: process.env.SMTP_SECURE === 'true',
    sender: process.env.SMTP_SENDER || 'test@ulep.fr',
  },
});
