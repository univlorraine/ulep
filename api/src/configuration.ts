/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { LogLevel } from '@nestjs/common';
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
  KEYCLOAK_ADMIN_ROLE_NAME: string;

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

  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsOptional()
  I18N_RELOAD_INTERVAL?: number;

  @IsString()
  @IsOptional()
  I18N_MINIO_URL?: string;

  @IsString()
  @IsOptional()
  APP_TRANSLATION_NAMESPACE: string;

  @IsString()
  @IsOptional()
  API_TRANSLATION_NAMESPACE: string;

  @IsString()
  @IsOptional()
  EMAIL_TRANSLATION_NAMESPACE: string;

  @IsString()
  @IsOptional()
  NOTIFICATION_TRANSLATION_NAMESPACE: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  I18N_DEBUG?: boolean;

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
  @Transform(({ value }) => removeTrailingSlash(value))
  EMAIL_ASSETS_PUBLIC_ENDPOINT: string;

  @IsString()
  @IsNotEmpty()
  NOTIFICATION_ASSETS_BUCKET: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => removeTrailingSlash(value))
  NOTIFICATION_ASSETS_PUBLIC_ENDPOINT: string;

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
  @IsNotEmpty()
  FIREBASE_PROJECT_ID: string;

  @IsString()
  @IsNotEmpty()
  FIREBASE_PRIVATE_KEY: string;

  @IsString()
  @IsNotEmpty()
  FIREBASE_CLIENT_EMAIL: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  FIREBASE_PARALLEL_LIMIT: number;

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

  @IsString()
  CHAT_URL: string;

  @IsString()
  @IsOptional()
  WEB_SERVICE_LOGOUT_TOKEN: string;

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

/// Testing configuration
const test: Env = {
  ADMIN_URL: 'http://localhost:3000',
  CHAT_URL: 'http://localhost:5001',
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
  KEYCLOAK_ADMIN_ROLE_NAME: 'admin',
  S3_URL: 'http://minio:9000',
  S3_REGION: 'eu-east-1',
  S3_ACCESS_KEY: 'minio',
  S3_ACCESS_SECRET: 'minio123',
  I18N_MINIO_URL: 'https://minio-api.ulep.thestaging.io/i18n',
  APP_TRANSLATION_NAMESPACE: 'translation',
  API_TRANSLATION_NAMESPACE: 'api',
  EMAIL_TRANSLATION_NAMESPACE: 'emails',
  NOTIFICATION_TRANSLATION_NAMESPACE: 'notifications',
  EMAIL_ASSETS_BUCKET: 'assets',
  EMAIL_ASSETS_PUBLIC_ENDPOINT: 'http://localhost:9000/assets',
  NOTIFICATION_ASSETS_BUCKET: 'assets',
  NOTIFICATION_ASSETS_PUBLIC_ENDPOINT: 'http://localhost:9000/assets',
  APP_LINK_APPLE_STORE: 'https://apple.com',
  APP_LINK_PLAY_STORE: 'https://play.google.com',
  SMTP_DISABLE_BOOT_VERIFICATION: false,
  SMTP_HOST: 'smtp.mailtrap.io',
  SMTP_PORT: 2525,
  SMTP_SECURE: false,
  SMTP_IGNORE_TLS: true,
  SMTP_SENDER: 'sender@localhost',
  FIREBASE_PROJECT_ID: '',
  FIREBASE_PRIVATE_KEY: '',
  FIREBASE_CLIENT_EMAIL: '',
  FIREBASE_PARALLEL_LIMIT: 3,
  CANCEL_TRESHOLD_IN_MIN: 15,
  SIGNED_URL_EXPIRATION_IN_SECONDS: 60,
  WEB_SERVICE_LOGOUT_TOKEN: 'test',
};
