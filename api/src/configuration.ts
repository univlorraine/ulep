import { Transform, plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
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

  @IsEnum(['error', 'warn', 'log', 'debug', 'verbose'])
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
  @Transform(({ value }) => removeTrailingSlash(value))
  EMAIL_ASSETS_PUBLIC_ENDPOINT: string;

  @IsString()
  @IsNotEmpty()
  APP_LINK_APPLE_STORE: string;

  @IsString()
  @IsNotEmpty()
  APP_LINK_PLAY_STORE: string;

  @IsDefined()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  SMTP_DISABLE_BOOT_VERIFICATION: boolean;

  @IsString()
  @IsNotEmpty()
  SMTP_HOST: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  SMTP_PORT: number;

  @IsDefined()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  SMTP_SECURE: boolean;

  @IsDefined()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  SMTP_IGNORE_TLS: boolean;

  @IsString()
  @IsNotEmpty()
  SMTP_SENDER: string;

  @IsString()
  @IsOptional()
  SENTRY_DSN?: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  CANCEL_TRESHOLD_IN_MIN: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  SIGNED_URL_EXPIRATION_IN_SECONDS: number;

  static validate(configuration: Record<string, unknown>): Env {
    const env = plainToClass(Env, configuration, {
      enableImplicitConversion: false,
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

const removeTrailingSlash = (url: string): string => {
  if (url.endsWith('/')) {
    return url.slice(0, -1);
  }

  return url;
};

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
  LOG_LEVEL: 'error',
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
  SIGNED_URL_EXPIRATION_IN_SECONDS: 60,
};
