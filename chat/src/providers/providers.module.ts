import { Module, Provider } from '@nestjs/common';
import { PrismaService, RedisModule } from '@app/common';
import { STORAGE_INTERFACE } from 'src/core/ports/storage.interface';
import { MinioStorage } from './storage/minio.storage';
import { ConfigModule } from '@nestjs/config';
import { MESSAGE_REPOSITORY } from 'src/core/ports/message.repository';
import { PrismaMessageRepository } from 'src/providers/persistance/repositories/prisma-message.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { UuidProvider } from 'src/providers/services/uuid.provider';
import { CONVERSATION_REPOSITORY } from 'src/core/ports/conversation.repository';
import { PrismaConversationRepository } from 'src/providers/persistance/repositories/prisma-conversation.repository';
import { MEDIA_OBJECT_REPOSITORY } from 'src/core/ports/media-object.repository';
import { PrismaMediaObjectRepository } from 'src/providers/persistance/repositories/prisma-media-object.repository';
import { HUB_GATEWAY } from 'src/core/ports/hub.gateway';
import { HubGateway } from 'src/providers/gateway/hub.gateway';
import { ROOM_REPOSITORY } from 'src/core/ports/room.repository';
import { RedisRoomService } from 'src/providers/services/room.service';
import { NOTIFICATION_SERVICE } from 'src/core/ports/notification.service';
import { NotificationService } from 'src/providers/services/notification.service';
import { HASHTAG_REPOSITORY } from 'src/core/ports/hastag.repository';
import { PrismaHashtagRepository } from 'src/providers/persistance/repositories/prisma-hashtag.repository';

const providers: Provider[] = [
    {
        provide: UUID_PROVIDER,
        useClass: UuidProvider,
    },
    {
        provide: STORAGE_INTERFACE,
        useClass: MinioStorage,
    },
    {
        provide: MEDIA_OBJECT_REPOSITORY,
        useClass: PrismaMediaObjectRepository,
    },
    {
        provide: MESSAGE_REPOSITORY,
        useClass: PrismaMessageRepository,
    },
    {
        provide: CONVERSATION_REPOSITORY,
        useClass: PrismaConversationRepository,
    },
    {
        provide: HUB_GATEWAY,
        useClass: HubGateway,
    },
    {
        provide: ROOM_REPOSITORY,
        useClass: RedisRoomService,
    },
    {
        provide: NOTIFICATION_SERVICE,
        useClass: NotificationService,
    },
    {
        provide: HASHTAG_REPOSITORY,
        useClass: PrismaHashtagRepository,
    },
];

@Module({
    imports: [ConfigModule, RedisModule],
    providers: [PrismaService, ...providers],
    exports: [...providers],
})
export class ProvidersModule {}
