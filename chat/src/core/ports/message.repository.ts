import { Message } from 'src/core/models';

export const MESSAGE_REPOSITORY = 'message.repository';

export interface MessageRepository {
    create: (message: Message) => Promise<Message>;
}
