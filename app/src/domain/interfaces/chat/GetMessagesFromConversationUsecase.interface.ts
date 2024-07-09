import { Message } from '../../entities/chat/Message';

interface GetMessagesFromConversationUsecaseInterface {
    execute(id: string, lastMessageId?: string, limit?: number): Promise<Message[] | Error>;
}

export default GetMessagesFromConversationUsecaseInterface;
