import { Message, MessageType } from 'src/core/models';

export const MESSAGE_REPOSITORY = 'message.repository';

export enum MessagePaginationDirection {
    FORWARD = 'forward',
    BACKWARD = 'backward',
    BOTH = 'both',
}

export type MessagePagination = {
    lastMessageId?: string;
    limit?: number;
    direction?: MessagePaginationDirection;
};

export interface MessageRepository {
    create: (message: Message, parentId?: string) => Promise<Message>;
    findById: (id: string) => Promise<Message | null>;
    findByMediaId: (mediaId: string) => Promise<Message | null>;
    findMessagesByConversationId: (
        id: string,
        pagination?: MessagePagination,
        hashtagFilter?: string,
        typeFilter?: MessageType,
    ) => Promise<Message[]>;
    findResponsesByMessageId: (
        messageId: string,
        pagination?: MessagePagination,
    ) => Promise<Message[]>;
    searchMessagesIdByConversationId: (
        id: string,
        search: string,
    ) => Promise<string[]>;
    like: (id: string, userId: string) => Promise<void>;
    unlike: (id: string, userId: string) => Promise<void>;
    update: (message: Message) => Promise<Message>;
}
