import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    MESSAGE_REPOSITORY,
    MessageFilters,
    MessageRepository,
} from 'src/core/ports/message.repository';

export class GetMessagesFromConversationIdCommand {
    id: string;
    pagination: MessageFilters;
}

@Injectable()
export class GetMessagesFromConversationIdUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
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
            );

        return messages;
    }
}
