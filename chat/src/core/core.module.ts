import { Module, Provider } from '@nestjs/common';
import {
    CreateConversationUsecase,
    CreateMessageUsecase,
    DeleteConversationUsecase,
    GetConversationFromUserIdUsecase,
    UpdateConversationUsecase,
    UploadMediaUsecase,
} from 'src/core/usecases';
import { ProvidersModule } from 'src/providers/providers.module';

const usecases: Provider[] = [
    CreateConversationUsecase,
    CreateMessageUsecase,
    DeleteConversationUsecase,
    GetConversationFromUserIdUsecase,
    UploadMediaUsecase,
    UpdateConversationUsecase,
];

const services: Provider[] = [];

@Module({
    imports: [ProvidersModule],
    providers: [...usecases, ...services],
    exports: [...usecases, ...services],
})
export class CoreModule {}
