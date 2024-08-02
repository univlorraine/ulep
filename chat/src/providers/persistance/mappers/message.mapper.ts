import { Prisma } from '@prisma/client';
import { Message } from 'src/core/models';
import { MessageType } from 'src/core/models/message.model';

const MessagesInclude = Prisma.validator<Prisma.MessageInclude>()({
    Conversation: true,
    MediaObject: true,
});

export const MessagesRelations = { include: MessagesInclude };

export type MessagesSnapshot = Prisma.MessageGetPayload<
    typeof MessagesRelations
>;

export const messageMapper = (snapshot: MessagesSnapshot): Message => {
    return new Message({
        id: snapshot.id,
        content: snapshot.MediaObject?.id
            ? snapshot.MediaObject.name
            : snapshot.content,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt,
        conversationId: snapshot.conversationId,
        isReported: snapshot.isReported,
        isDeleted: snapshot.isDeleted,
        ownerId: snapshot.ownerId,
        type: snapshot.type as MessageType,
        metadata: snapshot.metadata,
    });
};
