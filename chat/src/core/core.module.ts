import { Module, Provider } from '@nestjs/common';
import {
    CreateConversationUsecase,
    CreateMessageUsecase,
    CreateMultipleConversationsUsecase,
    DeleteContactConversationUsecase,
    DeleteConversationUsecase,
    DeleteUserConversationUsecase,
    GetConversationFromUserIdUsecase,
    GetMessagesFromConversationIdUsecase,
    SearchMessagesIdFromConversationIdUsecase,
    UpdateConversationUsecase,
    UpdateMessageUsecase,
    UploadMediaUsecase,
} from 'src/core/usecases';
import { PurgeChatUsecase } from 'src/core/usecases/purge/purge-chat.usecase';
import { ProvidersModule } from 'src/providers/providers.module';

const usecases: Provider[] = [
    CreateConversationUsecase,
    CreateMessageUsecase,
    CreateMultipleConversationsUsecase,
    DeleteConversationUsecase,
    DeleteContactConversationUsecase,
    DeleteUserConversationUsecase,
    GetConversationFromUserIdUsecase,
    GetMessagesFromConversationIdUsecase,
    PurgeChatUsecase,
    SearchMessagesIdFromConversationIdUsecase,
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
