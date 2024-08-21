import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    MESSAGE_REPOSITORY,
    MessageRepository,
} from 'src/core/ports/message.repository';

export class SearchMessagesIdFromConversationIdCommand {
    id: string;
    search: string;
}

@Injectable()
export class SearchMessagesIdFromConversationIdUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
    ) {}

    async execute(command: SearchMessagesIdFromConversationIdCommand) {
        const conversation = await this.conversationRepository.findById(
            command.id,
        );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        const messagesIds =
            await this.messageRepository.searchMessagesIdByConversationId(
                command.id,
                command.search,
            );

        return messagesIds;
    }
}
