import { Message } from 'src/core/models';

export const MESSAGE_REPOSITORY = 'message.repository';

export interface MessageRepository {
    create: (message: Message) => Promise<Message>;
    findById: (id: string) => Promise<Message | null>;
    update: (message: Message) => Promise<Message>;
}
