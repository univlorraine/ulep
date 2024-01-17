import { LogLevel } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export class Env {
  @IsString()
  @IsNotEmpty()
  ADMIN_URL: string;

  @IsString()
  @IsNotEmpty()
  APP_URL: string;

  @IsEnum(['verbose', 'debug', 'warn', 'error', 'log'])
  @IsOptional()
  LOG_LEVEL?: string;

  @IsString()
  @IsNotEmpty()
  DEFAULT_TRANSLATION_LANGUAGE: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  KEYCLOAK_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  KEYCLOAK_REALM: string;

  @IsString()
  @IsNotEmpty()
  KEYCLOAK_ADMIN: string;

  @IsString()
  @IsNotEmpty()
  KEYCLOAK_ADMIN_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  KEYCLOAK_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  KEYCLOAK_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  KEYCLOAK_ADMIN_GROUP_ID: string;

  @IsString()
  @IsNotEmpty()
  S3_URL: string;

  @IsString()
  @IsNotEmpty()
  S3_REGION: string;

  @IsString()
  @IsNotEmpty()
  S3_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  S3_ACCESS_SECRET: string;

  @IsString()
  @IsNotEmpty()
  TRANSLATIONS_ENDPOINT: string;

  @IsString()
  TRANSLATIONS_ENDPOINT_SUFFIX: string;

  @IsString()
  TRANSLATIONS_TOKEN: string;

  @IsString()
  @IsOptional()
  CONNECTOR_URL?: string;

  @IsString()
  @IsOptional()
  CONNECTOR_TOKEN?: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_ASSETS_BUCKET: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_TRANSLATIONS_COMPONENT: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_ASSETS_PUBLIC_ENDPOINT: string;

  @IsString()
  @IsNotEmpty()
  APP_LINK_APPLE_STORE: string;

  @IsString()
  @IsNotEmpty()
  APP_LINK_PLAY_STORE: string;

  @IsBoolean()
  SMTP_DISABLE_BOOT_VERIFICATION: boolean;

  @IsString()
  @IsNotEmpty()
  SMTP_HOST: string;

  @IsNumber()
  SMTP_PORT: number;

  @IsBoolean()
  SMTP_SECURE: boolean;

  @IsBoolean()
  SMTP_IGNORE_TLS: boolean;

  @IsString()
  @IsNotEmpty()
  SMTP_SENDER: string;

  @IsString()
  @IsOptional()
  SENTRY_DSN?: string;

  @IsInt()
  @IsOptional()
  CANCEL_TRESHOLD_IN_MIN: number;

  static DEFAULT_LOG_LEVEL: LogLevel = 'warn';

  static validate(configuration: Record<string, unknown>): Env {
    const env = plainToClass(Env, configuration, {
      enableImplicitConversion: true,
    });

    if (process.env.NODE_ENV === 'test') {
      return test;
    }

    const errors = validateSync(env, { skipMissingProperties: false });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return env;
  }
}

export const getTranslationsEndpoint = (
  lng: string,
  component: string,
): string => {
  const endpoint = process.env.TRANSLATIONS_ENDPOINT || '';
  const suffix = process.env.TRANSLATIONS_ENDPOINT_SUFFIX || '';
  // %2F work with github and gitlab but / doesn't with gitlab ( ??? )
  return `${endpoint}%2F${lng}%2F${component}.json${suffix}`;
};

/// Testing configuration
const test: Env = {
  ADMIN_URL: 'http://localhost:3000',
  APP_URL: 'http://localhost:4200',
  LOG_LEVEL: 'debug',
  DEFAULT_TRANSLATION_LANGUAGE: 'fr',
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/test',
  KEYCLOAK_BASE_URL: 'http://localhost:8080/auth',
  KEYCLOAK_REALM: 'master',
  KEYCLOAK_ADMIN: 'admin',
  KEYCLOAK_ADMIN_PASSWORD: 'admin',
  KEYCLOAK_CLIENT_ID: 'admin-cli',
  KEYCLOAK_CLIENT_SECRET: 'f0a0c0e0-0000-0000-0000-000000000000',
  KEYCLOAK_ADMIN_GROUP_ID: 'admin',
  S3_URL: 'http://minio:9000',
  S3_REGION: 'eu-east-1',
  S3_ACCESS_KEY: 'minio',
  S3_ACCESS_SECRET: 'minio123',
  TRANSLATIONS_ENDPOINT: 'http://localhost:3000/api/translations',
  TRANSLATIONS_ENDPOINT_SUFFIX: '',
  TRANSLATIONS_TOKEN: 'test',
  EMAIL_ASSETS_BUCKET: 'assets',
  EMAIL_TRANSLATIONS_COMPONENT: 'email',
  EMAIL_ASSETS_PUBLIC_ENDPOINT: 'http://localhost:9000/assets',
  APP_LINK_APPLE_STORE: 'https://apple.com',
  APP_LINK_PLAY_STORE: 'https://play.google.com',
  SMTP_DISABLE_BOOT_VERIFICATION: false,
  SMTP_HOST: 'smtp.mailtrap.io',
  SMTP_PORT: 2525,
  SMTP_SECURE: false,
  SMTP_IGNORE_TLS: true,
  SMTP_SENDER: 'sender@localhost',
  CANCEL_TRESHOLD_IN_MIN: 15,
};

// Production and development configuration
// Loaded from environment variables
export default (): Env => ({
  ADMIN_URL: process.env.ADMIN_URL,
  APP_URL: process.env.APP_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
  DEFAULT_TRANSLATION_LANGUAGE: process.env.DEFAULT_TRANSLATION_LANGUAGE,
  DATABASE_URL: process.env.DATABASE_URL,
  KEYCLOAK_BASE_URL: process.env.KEYCLOAK_BASE_URL,
  KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
  KEYCLOAK_ADMIN: process.env.KEYCLOAK_ADMIN,
  KEYCLOAK_ADMIN_PASSWORD: process.env.KEYCLOAK_ADMIN_PASSWORD,
  KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
  KEYCLOAK_ADMIN_GROUP_ID: process.env.KEYCLOAK_ADMIN_GROUP_ID,
  S3_URL: process.env.S3_URL,
  S3_REGION: process.env.S3_REGION,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_ACCESS_SECRET: process.env.S3_ACCESS_SECRET,
  TRANSLATIONS_ENDPOINT: process.env.TRANSLATIONS_ENDPOINT,
  TRANSLATIONS_ENDPOINT_SUFFIX: process.env.TRANSLATIONS_ENDPOINT_SUFFIX,
  TRANSLATIONS_TOKEN: process.env.TRANSLATIONS_TOKEN,
  CONNECTOR_URL: process.env.CONNECTOR_URL,
  CONNECTOR_TOKEN: process.env.CONNECTOR_TOKEN,
  EMAIL_ASSETS_BUCKET: process.env.EMAIL_ASSETS_BUCKET,
  EMAIL_TRANSLATIONS_COMPONENT: process.env.EMAIL_TRANSLATIONS_COMPONENT,
  EMAIL_ASSETS_PUBLIC_ENDPOINT: process.env.EMAIL_ASSETS_PUBLIC_ENDPOINT,
  APP_LINK_APPLE_STORE: process.env.APP_LINK_APPLE_STORE,
  APP_LINK_PLAY_STORE: process.env.APP_LINK_PLAY_STORE,
  SMTP_DISABLE_BOOT_VERIFICATION: Boolean(
    process.env.SMTP_DISABLE_BOOT_VERIFICATION,
  ),
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10),
  SMTP_SECURE: Boolean(process.env.SMTP_SECURE),
  SMTP_IGNORE_TLS: Boolean(process.env.SMTP_IGNORE_TLS),
  SMTP_SENDER: process.env.SMTP_SENDER,
  SENTRY_DSN: process.env.SENTRY_DSN,
  CANCEL_TRESHOLD_IN_MIN: parseInt(process.env.CANCEL_TRESHOLD_IN_MIN, 10),
});
