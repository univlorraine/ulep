import { Inject } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    STORAGE_INTERFACE,
    StorageInterface,
} from 'src/core/ports/storage.interface';

export class PurgeChatUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(STORAGE_INTERFACE)
        private readonly storage: StorageInterface,
    ) {}

    async execute() {
        await this.conversationRepository.deleteAll();
        await this.storage.deleteBucketContents('chat');
    }
}
