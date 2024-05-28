import { Prisma } from '@prisma/client';
import { Conversation } from 'src/core/models';
import { MessagesRelations, messageMapper } from 'src/providers/mappers';

const ConversationInclude = Prisma.validator<Prisma.ConversationInclude>()({
    Messages: MessagesRelations,
});

export const ConversationRelations = { include: ConversationInclude };

export type ConversationSnapshot = Prisma.ConversationGetPayload<
    typeof ConversationRelations
>;

export const conversationMapper = (
    snapshot: ConversationSnapshot,
): Conversation => {
    return new Conversation({
        id: snapshot.id,
        usersIds: snapshot.participantIds,
        lastActivity: snapshot.lastActivityAt,
        lastMessage: messageMapper(snapshot.Messages[0]), // TODO: Update this to get the true last message
        metadata: snapshot.metadata,
        createdAt: snapshot.createdAt,
    });
};
