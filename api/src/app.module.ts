import { KeycloakModule } from '@app/keycloak';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './configuration';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { ProfilesModule } from './core/profiles/profiles.module';
import { UploadsModule } from './core/uploads/uploads.module';
import { UsersModule } from './core/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    KeycloakModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => config.get('keycloak'),
      inject: [ConfigService],
    }),
    AuthenticationModule,
    ProfilesModule,
    UploadsModule,
    UsersModule,
  ],
})
export class AppModule {}
