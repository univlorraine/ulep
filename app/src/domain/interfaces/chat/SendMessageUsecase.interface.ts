import { MessageWithoutSender } from '../../entities/chat/Message';

interface SendMessageUsecaseInterface {
    execute(
        conversationId: string,
        senderId: string,
        content?: string,
        file?: File
    ): Promise<MessageWithoutSender | Error>;
}

export default SendMessageUsecaseInterface;
