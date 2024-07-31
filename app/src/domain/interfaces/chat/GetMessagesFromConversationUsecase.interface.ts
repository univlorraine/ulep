import { Message } from '../../entities/chat/Message';

export interface GetMessagesFromConversationUsecaseParams {
    lastMessageId?: string;
    limit?: number;
    typeFilter?: string;
}

interface GetMessagesFromConversationUsecaseInterface {
    execute(id: string, params: GetMessagesFromConversationUsecaseParams): Promise<Message[] | Error>;
}

export default GetMessagesFromConversationUsecaseInterface;
