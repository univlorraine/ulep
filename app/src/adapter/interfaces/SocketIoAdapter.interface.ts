import { Message } from '../../domain/entities/chat/Message';

interface SocketIoAdapterInterface {
    isConnected(): boolean;
    connect(token: string): void;
    disconnect(): void;
    emit(message: Message): Message;
    offMessage(): void;
    offDisconnect(): void;
    onDisconnect(handler: () => void): void;
    onMessage(conversationId: string, handler: (message: Message) => void): void;
}

export default SocketIoAdapterInterface;
