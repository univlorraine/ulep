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
    create: (message: Message) => Promise<Message>;
    findById: (id: string) => Promise<Message | null>;
    findMessagesByConversationId: (
        id: string,
        pagination?: MessagePagination,
        contentFilter?: string,
        typeFilter?: MessageType,
    ) => Promise<Message[]>;
    update: (message: Message) => Promise<Message>;
}
