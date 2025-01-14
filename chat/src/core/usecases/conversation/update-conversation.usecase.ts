import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';

export class UpdateConversationCommand {
    id: string;
    usersToAdd: string[];
    metadata: any;
}

@Injectable()
export class UpdateConversationUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: UpdateConversationCommand) {
        const oldConversation = await this.assertConversationExists(command.id);

        const conversation = await this.conversationRepository.update(
            command.id,
            [...oldConversation.usersIds, ...command.usersToAdd],
            { ...oldConversation.metadata, ...command.metadata },
        );

        return conversation;
    }

    async assertConversationExists(conversationId: string) {
        const conversation = await this.conversationRepository.findById(
            conversationId,
        );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        return conversation;
    }
}
