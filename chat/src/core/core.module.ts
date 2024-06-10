import { Module, Provider } from '@nestjs/common';
import {
    CreateConversationUsecase,
    CreateMessageUsecase,
    DeleteConversationUsecase,
    GetConversationFromUserIdUsecase,
    GetMessagesFromConversationIdUsecase,
    UpdateConversationUsecase,
    UpdateMessageUsecase,
    UploadMediaUsecase,
} from 'src/core/usecases';
import { ProvidersModule } from 'src/providers/providers.module';

const usecases: Provider[] = [
    CreateConversationUsecase,
    CreateMessageUsecase,
    DeleteConversationUsecase,
    GetConversationFromUserIdUsecase,
    GetMessagesFromConversationIdUsecase,
    UploadMediaUsecase,
    UpdateConversationUsecase,
    UpdateMessageUsecase,
];

const services: Provider[] = [];

@Module({
    imports: [ProvidersModule],
    providers: [...usecases, ...services],
    exports: [...usecases, ...services],
})
export class CoreModule {}
