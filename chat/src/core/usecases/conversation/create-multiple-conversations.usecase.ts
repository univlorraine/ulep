import { Inject, Injectable } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
    CreateConversations,
} from 'src/core/ports/conversation.repository';

export class CreateMultipleConversationsCommand {
    conversations: CreateConversations[];
}

@Injectable()
export class CreateMultipleConversationsUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: CreateMultipleConversationsCommand) {
        const tandemIds = command.conversations
            .filter((conversation) => conversation.tandemId)
            .map((conversation) => conversation.tandemId);

        const participantGroups = command.conversations.map(
            (conversation) => conversation.participants,
        );

        const existingConversations =
            await this.conversationRepository.findConversationsByIdsOrParticipants(
                tandemIds,
                participantGroups,
            );

        const newConversations = command.conversations.filter(
            (conversation) => {
                const existsByTandemId = existingConversations.some(
                    (existing) => existing.id === conversation.tandemId,
                );

                const existsByParticipants = existingConversations.some(
                    (existing) =>
                        existing.usersIds.length ===
                            conversation.participants.length &&
                        existing.usersIds.every((participant) =>
                            conversation.participants.includes(participant),
                        ),
                );

                const uniqueUserIds = new Set(conversation.participants);
                const hasDifferentUserIds =
                    uniqueUserIds.size !== conversation.participants.length;

                return (
                    !existsByTandemId &&
                    !existsByParticipants &&
                    !hasDifferentUserIds
                );
            },
        );

        if (newConversations.length > 0) {
            await this.conversationRepository.createConversations(
                newConversations,
            );
        }
    }
}
