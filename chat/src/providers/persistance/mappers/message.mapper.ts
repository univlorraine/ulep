import { Prisma } from '@prisma/client';
import { Message } from 'src/core/models';
import { MessageLike, MessageType } from 'src/core/models/message.model';

const MessagesInclude = Prisma.validator<Prisma.MessageInclude>()({
    Conversation: true,
    MediaObject: true,
    Thumbnail: true,
    MessageLikes: true,
    Replies: true,
    ParentMessage: {
        include: {
            Conversation: true,
            MediaObject: true,
            Thumbnail: true,
            MessageLikes: true,
            Replies: true,
        },
    },
});

export const MessagesRelations = { include: MessagesInclude };

export type MessagesSnapshot = Prisma.MessageGetPayload<
    typeof MessagesRelations
>;

export const messageMapper = (snapshot: Partial<MessagesSnapshot>): Message => {
    return new Message({
        id: snapshot.id,
        content: snapshot.MediaObject?.id
            ? snapshot.MediaObject.name
            : snapshot.content,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt,
        conversationId: snapshot.conversationId,
        usersLiked: snapshot.MessageLikes
            ? snapshot.MessageLikes.map(
                  (like) =>
                      new MessageLike({
                          messageId: like.messageId,
                          userId: like.userId,
                      }),
              )
            : [],
        isReported: snapshot.isReported,
        isDeleted: snapshot.isDeleted,
        ownerId: snapshot.ownerId,
        type: snapshot.type as MessageType,
        numberOfReplies: snapshot.Replies?.length ?? 0,
        parent: snapshot.ParentMessage
            ? messageMapper(snapshot.ParentMessage)
            : undefined,
        metadata: {
            ...(snapshot.metadata as any),
            thumbnail: snapshot.Thumbnail?.id
                ? snapshot.Thumbnail?.name
                : undefined,
        },
    });
};
