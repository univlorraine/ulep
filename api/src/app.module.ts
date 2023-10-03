import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './configuration';
import { ApiModule } from './api/api.module';
import { KeycloakModule } from '@app/keycloak';
// import { GatewayModule } from './providers/gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    KeycloakModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => config.get('keycloak'),
      inject: [ConfigService],
    }),
    ApiModule,
  ],
})
export class AppModule {}
