import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MessageType } from 'src/core/models';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    MESSAGE_REPOSITORY,
    MessagePagination,
    MessageRepository,
} from 'src/core/ports/message.repository';
import {
    STORAGE_INTERFACE,
    StorageInterface,
} from 'src/core/ports/storage.interface';

export class GetMessagesFromConversationIdCommand {
    id: string;
    pagination: MessagePagination;
    filter: string;
}

@Injectable()
export class GetMessagesFromConversationIdUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
        @Inject(STORAGE_INTERFACE)
        private readonly storage: StorageInterface,
    ) {}

    async execute(command: GetMessagesFromConversationIdCommand) {
        const conversation = await this.conversationRepository.findById(
            command.id,
        );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        const messages =
            await this.messageRepository.findMessagesByConversationId(
                command.id,
                command.pagination,
                command.filter,
            );

        for (const message of messages) {
            if (message.type === MessageType.Image) {
                message.content = await this.storage.temporaryUrl(
                    'chat',
                    `${conversation.id}/${message.content}`,
                    3600,
                );
            }
        }

        return messages;
    }
}
