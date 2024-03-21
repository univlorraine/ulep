import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { KeycloakModule } from '@app/keycloak';
import { Env } from './configuration';
import { MailerModule } from '@app/common';
import { I18nModule } from '@app/common/i18n/i18n.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: Env.validate,
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
            url: env.get('WEBLATE_API_URL'),
            token: env.get('WEBLATE_API_TOKEN'),
            reloadInterval: env.get('WEBLATE_RELOAD_INTERVAL'),
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
        adminGroupId: env.get<string>('KEYCLOAK_ADMIN_GROUP_ID'),
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
