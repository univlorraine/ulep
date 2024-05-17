import { Module } from '@nestjs/common';
import { AUTHENTICATOR } from './services/authenticator.interface';
import { KeycloakAuthenticator } from './services/keycloak.authenticator';
import { ConversationController } from 'src/api/controllers/conversation.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from 'src/api/controllers/health.controller';
import { PrismaService } from '@app/common';

@Module({
    imports: [TerminusModule],
    controllers: [ConversationController, HealthController],
    providers: [
        {
            provide: AUTHENTICATOR,
            useClass: KeycloakAuthenticator,
        },
        PrismaService,
    ],
})
export class ApiModule {}
