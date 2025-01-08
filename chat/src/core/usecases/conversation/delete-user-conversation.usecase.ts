import { Inject, Injectable } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';

export class DeleteUserConversationCommand {
    id: string;
    chatIdsToIgnore: string[];
    chatIdsToLeave: string[];
}

@Injectable()
export class DeleteUserConversationUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: DeleteUserConversationCommand) {
        const conversations = await this.conversationRepository.findByUserId(
            command.id,
        );

        const chatIdsToIgnoreSet = new Set(command.chatIdsToIgnore);

        const conversationsToDelete = conversations.items.filter(
            (conversation) => !chatIdsToIgnoreSet.has(conversation.id),
        );

        const deletePromises = conversationsToDelete.map(
            async (conversation) => {
                if (
                    conversation.usersIds.length === 2 &&
                    !command.chatIdsToLeave.includes(conversation.id)
                ) {
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
