import { KeycloakConfiguration } from '@app/keycloak';
import { LogLevel } from '@nestjs/common';

interface SmtpConfiguration {
  host: string;
  port: number;
  secure: boolean;
  sender: string;
  disableBootVerification: boolean;
}

export type Configuration = {
  port: number;
  keycloak: KeycloakConfiguration;
  adminRole: string;
  defaultTranslationLanguage: string;
  CANCEL_TRESHOLD_IN_MIN: number;
  smtp: SmtpConfiguration;
  logLevel: string;
  emailTranslationsComponent: string;
  emailAssets: {
    endpoint: string;
    bucket: string;
  };
  appLinks: {
    appleStore: string;
    playStore: string;
  };
  translations: {
    endpoint: string;
    endpointSuffix: string;
    token: string;
  };
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
    disableBootVerification:
      process.env.SMTP_DISABLE_BOOT_VERIFICATION === 'true',
    host: process.env.SMTP_HOST || 'localhost',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 25,
    secure: process.env.SMTP_SECURE === 'true',
    sender: process.env.SMTP_SENDER || 'test@ulep.fr',
  },
  logLevel: process.env.LOG_LEVEL || 'warn',
  emailTranslationsComponent:
    process.env.EMAIL_TRANSLATIONS_COMPONENT || 'emails',
  emailAssets: {
    endpoint: process.env.EMAIL_ASSETS_ENDPOINT || 'http://localhost:9000',
    bucket: process.env.EMAIL_ASSETS_BUCKET || 'assets',
  },
  appLinks: {
    appleStore:
      process.env.APP_LINK_APPLE_STORE || 'http://apple-store.fr/etandem',
    playStore:
      process.env.APP_LINK_PLAY_STORE || 'http://play-store.fr/etandem',
  },
  translations: {
    endpoint:
      process.env.TRANSLATION_ENDPOINT ||
      'https://raw.githubusercontent.com/thetribeio/locales_ulep/main/locales',
    endpointSuffix: process.env.TRANSLATION_ENDPOINT_SUFFIX || '',
    token: process.env.TRANSLATION_TOKEN || '',
  },
});

export const getLoggerLevels = (logLevel: string): LogLevel[] => {
  const level: LogLevel[] = [];
  switch (logLevel) {
    case 'verbose':
      level.push('verbose');
    case 'debug':
      level.push('debug');
    case 'warn':
      level.push('warn');
    case 'error':
      level.push('error');
    case 'log':
      level.push('log');
      break;
    default:
      break;
  }
  return level;
};

export const getTranslationsEndpoint = (
  lng: string,
  component: string,
): string => {
  const config = configuration();
  // %2F work with github and gitlab but / doesn't with gitlab ( ??? )
  return `${config.translations.endpoint}%2F${lng}%2F${component}.json${config.translations.endpointSuffix}`;
};
