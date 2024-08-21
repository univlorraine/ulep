import { Message } from '../../domain/entities/chat/Message';

interface SocketIoAdapterInterface {
    connect(token: string): void;
    disconnect(): void;
    emit(message: Message): Message;
    offMessage(): void;
    onMessage(conversationId: string, handler: (message: Message) => void): void;
}

export default SocketIoAdapterInterface;
