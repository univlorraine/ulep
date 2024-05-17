import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { Env } from './configuration';
import { KeycloakModule } from '@app/keycloak/keycloak.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: Env.validate,
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
            }),
            inject: [ConfigService],
        }),
        ApiModule,
    ],
})
export class AppModule {}
