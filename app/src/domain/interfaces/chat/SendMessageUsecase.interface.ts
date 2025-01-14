import { MessageType, MessageWithoutSender } from '../../entities/chat/Message';

export interface SendMessageUsecasePayload {
    conversationId: string;
    senderId: string;
    content?: string;
    file?: File;
    filename?: string;
    type?: MessageType;
    parentId?: string;
}

interface SendMessageUsecaseInterface {
    execute(payload: SendMessageUsecasePayload): Promise<MessageWithoutSender | Error>;
}

export default SendMessageUsecaseInterface;
