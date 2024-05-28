import { Prisma } from '@prisma/client';
import { Message } from 'src/core/models';
import { MessageType } from 'src/core/models/message.model';
import { ownerMapper } from 'src/providers/mappers';

const MessagesInclude = Prisma.validator<Prisma.MessageInclude>()({
    Owner: true,
    Conversation: true,
});

export const MessagesRelations = { include: MessagesInclude };

export type MessagesSnapshot = Prisma.MessageGetPayload<
    typeof MessagesRelations
>;

export const messageMapper = (snapshot: MessagesSnapshot): Message => {
    return new Message({
        id: snapshot.id,
        content: snapshot.content,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt,
        conversationId: snapshot.conversationId,
        isReported: snapshot.isReported,
        owner: ownerMapper(snapshot.Owner),
        type: snapshot.type as MessageType,
    });
};
