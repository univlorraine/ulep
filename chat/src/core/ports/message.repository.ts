import { Message, MessageType } from 'src/core/models';

export const MESSAGE_REPOSITORY = 'message.repository';

export type MessagePagination = {
    lastMessageId?: string;
    limit?: number;
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
