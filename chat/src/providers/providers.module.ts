import { Module, Provider } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { STORAGE_INTERFACE } from 'src/core/ports/storage.interface';
import { MinioStorage } from './storage/minio.storage';
import { ConfigModule } from '@nestjs/config';
import { MESSAGE_REPOSITORY } from 'src/core/ports/message.repository';
import { PrismaMessageRepository } from 'src/providers/persistance/repositories/prisma-message.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { UuidProvider } from 'src/providers/services/uuid.provider';

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
        provide: MESSAGE_REPOSITORY,
        useClass: PrismaMessageRepository,
    },
];

@Module({
    imports: [ConfigModule],
    providers: [PrismaService, ...providers],
    exports: [...providers],
})
export class ProvidersModule {}
