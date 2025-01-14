import { Message } from '../../domain/entities/chat/Message';

interface SocketIoAdapterInterface {
    isConnected(): boolean;
    connect(token: string): void;
    disconnect(): void;
    emit(message: Message): Message;
    like(conversationId: string, messageId: string, userId: string): void;
    unlike(conversationId: string, messageId: string, userId: string): void;
    offMessage(): void;
    offLike(): void;
    offUnlike(): void;
    offDisconnect(): void;
    onDisconnect(handler: () => void): void;
    onMessage(conversationId: string, handler: (message: Message) => void): void;
    onLiked(conversationId: string, handler: (messageId: string, userId: string) => void): void;
    onUnliked(conversationId: string, handler: (messageId: string, userId: string) => void): void;
}

export default SocketIoAdapterInterface;
