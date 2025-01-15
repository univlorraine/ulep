import { Module, Provider } from '@nestjs/common';
import {
    CreateConversationUsecase,
    CreateMessageUsecase,
    CreateMultipleConversationsUsecase,
    DeleteUserConversationUsecase,
    DeleteConversationUsecase,
    GetConversationFromUserIdUsecase,
    GetHashtagsFromConversationIdUsecase,
    GetMessagesFromConversationIdUsecase,
    SearchMessagesIdFromConversationIdUsecase,
    UpdateConversationUsecase,
    UpdateMessageUsecase,
    UploadMediaUsecase,
    ExportMediasFromConversationUsecase,
} from 'src/core/usecases';
import { PurgeChatUsecase } from 'src/core/usecases/purge/purge-chat.usecase';
import { ProvidersModule } from 'src/providers/providers.module';

const usecases: Provider[] = [
    CreateConversationUsecase,
    CreateMessageUsecase,
    CreateMultipleConversationsUsecase,
    DeleteConversationUsecase,
    DeleteUserConversationUsecase,
    GetConversationFromUserIdUsecase,
    GetHashtagsFromConversationIdUsecase,
    GetMessagesFromConversationIdUsecase,
    PurgeChatUsecase,
    SearchMessagesIdFromConversationIdUsecase,
    UploadMediaUsecase,
    UpdateConversationUsecase,
    UpdateMessageUsecase,
    ExportMediasFromConversationUsecase,
];

const services: Provider[] = [];

@Module({
    imports: [ProvidersModule],
    providers: [...usecases, ...services],
    exports: [...usecases, ...services],
})
export class CoreModule {}
