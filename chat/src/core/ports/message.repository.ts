import { Message } from 'src/core/models';

export const MESSAGE_REPOSITORY = 'message.repository';

export type MessagePagination = {
    offset?: number;
    limit?: number;
};

export interface MessageRepository {
    create: (message: Message) => Promise<Message>;
    findById: (id: string) => Promise<Message | null>;
    findMessagesByConversationId: (
        id: string,
        pagination?: MessagePagination,
        filter?: string,
    ) => Promise<Message[]>;
    update: (message: Message) => Promise<Message>;
}
