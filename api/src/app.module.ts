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

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { KeycloakModule } from '@app/keycloak';
import { Env } from './configuration';
import { FCMModule, MailerModule } from '@app/common';
import { I18nModule } from '@app/common/i18n/i18n.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: Env.validate,
    }),
    ScheduleModule.forRoot(),
    FCMModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (env: ConfigService<Env, true>) => ({
        firebaseProjectId: env.get<string>('FIREBASE_PROJECT_ID'),
        firebasePrivateKey: env.get<string>('FIREBASE_PRIVATE_KEY'),
        firebaseClientEmail: env.get<string>('FIREBASE_CLIENT_EMAIL'),
        firebaseParallelLimit: env.get<number>('FIREBASE_PARALLEL_LIMIT'),
      }),
      inject: [ConfigService],
    }),
    I18nModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (env: ConfigService<Env, true>) => {
        const fallbackLanguage = env
          .get('DEFAULT_TRANSLATION_LANGUAGE')
          .toLowerCase();
        console.info(`Default translation language: ${fallbackLanguage}`);
        return {
          fallbackLanguage: fallbackLanguage,
          debug: env.get('I18N_DEBUG'),
          http: {
            url: env.get('I18N_MINIO_URL'),
            reloadInterval: env.get('I18N_RELOAD_INTERVAL'),
          },
        };
      },
      inject: [ConfigService],
    }),
    KeycloakModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (env: ConfigService<Env, true>) => ({
        baseUrl: env.get<string>('KEYCLOAK_BASE_URL'),
        realm: env.get<string>('KEYCLOAK_REALM'),
        username: env.get<string>('KEYCLOAK_ADMIN'),
        password: env.get<string>('KEYCLOAK_ADMIN_PASSWORD'),
        clientId: env.get<string>('KEYCLOAK_CLIENT_ID'),
        clientSecret: env.get<string>('KEYCLOAK_CLIENT_SECRET'),
        adminRoleName: env.get<string>('KEYCLOAK_ADMIN_ROLE_NAME'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (env: ConfigService<Env, true>) => ({
        host: env.get<string>('SMTP_HOST'),
        port: env.get<number>('SMTP_PORT'),
        secure: env.get<boolean>('SMTP_SECURE'),
        ignoreTLS: env.get<boolean>('SMTP_IGNORE_TLS'),
        emailFrom: env.get<string>('SMTP_SENDER'),
        disableBootVerification: env.get<boolean>(
          'SMTP_DISABLE_BOOT_VERIFICATION',
        ),
        templatesPath: 'templates/',
      }),
      inject: [ConfigService],
    }),
    ApiModule,
  ],
})
export class AppModule {}
