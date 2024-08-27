import { Inject, Injectable } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';

export class DeleteContactConversationCommand {
    id: string;
    chatIdsToIgnore: string[];
}

@Injectable()
export class DeleteContactConversationUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: DeleteContactConversationCommand) {
        const conversations = await this.conversationRepository.findByUserId(
            command.id,
        );

        const chatIdsToIgnoreSet = new Set(command.chatIdsToIgnore);

        const conversationsToDelete = conversations.items.filter(
            (conversation) => !chatIdsToIgnoreSet.has(conversation.id),
        );

        const deletePromises = conversationsToDelete.map(
            async (conversation) => {
                if (conversation.usersIds.length === 2) {
                    return this.conversationRepository.delete(conversation.id);
                } else {
                    const updatedUserIds = conversation.usersIds.filter(
                        (userId) => userId !== command.id,
                    );
                    return this.conversationRepository.update(
                        conversation.id,
                        updatedUserIds,
                        conversation.metadata,
                    );
                }
            },
        );

        await Promise.all(deletePromises);
    }
}
