import socketIo, { Socket } from 'socket.io-client';
import { Message, MessageWithConversationId } from '../domain/entities/chat/Message';
import { UserChat } from '../domain/entities/User';
import SocketIoAdapterInterface from './interfaces/SocketIoAdapter.interface';

class SocketIoAdapter implements SocketIoAdapterInterface {
    private chatUrl: string;
    private socket: Socket | null = null;

    constructor(chatUrl: string) {
        this.chatUrl = chatUrl;
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    connect(accessToken: string): void {
        if (this.socket && this.socket.connected) {
            return;
        }
        this.socket = socketIo(this.chatUrl, { auth: { token: accessToken } });
    }

    disconnect(): void {
        if (this.socket && this.socket.connected) {
            this.socket.disconnect();
        }
    }

    onDisconnect(handler: () => void): void {
        this.socket!.on('disconnect', handler);
    }

    emit(message: Message): Message {
        this.socket?.emit('publish', message);
        return message;
    }

    like(conversationId: string, messageId: string, userId: string): void {
        this.socket?.emit('like', conversationId, messageId, userId);
    }

    unlike(conversationId: string, messageId: string, userId: string): void {
        this.socket?.emit('unlike', conversationId, messageId, userId);
    }

    onLiked(currentConversationId: string, handler: (messageId: string, userId: string) => void): void {
        this.socket!.on('liked', (conversationId: string, messageId: string, userId: string) => {
            if (conversationId !== currentConversationId) {
                return;
            }

            handler(messageId, userId);
        });
    }

    onUnliked(currentConversationId: string, handler: (messageId: string, userId: string) => void): void {
        this.socket!.on('unliked', (conversationId: string, messageId: string, userId: string) => {
            if (conversationId !== currentConversationId) {
                return;
            }

            handler(messageId, userId);
        });
    }

    onMessage(conversationId: string, handler: (message: Message) => void): void {
        //TODO: Later if asked we can call antoher function to update the last message conversation through this
        //TODO: If not conversationId then call the handler for other conversation that will call an injected function to parent
        //TODO: that will update ConversationContent ( WEB ONLY )
        this.socket!.on('message', (message: MessageWithConversationId) => {
            if (conversationId !== message.conversationId) {
                return;
            }

            handler(
                new Message(
                    message.id,
                    message.content,
                    new Date(message.createdAt),
                    new UserChat(
                        message.sender.id,
                        message.sender.firstname,
                        message.sender.lastname,
                        message.sender.email,
                        false,
                        message.sender.avatar
                    ),
                    message.type,
                    0,
                    false,
                    message.metadata
                )
            );
        });
    }

    offMessage(): void {
        this.socket!.off('message');
    }

    offDisconnect(): void {
        this.socket!.off('disconnect');
    }

    offLike(): void {
        this.socket!.off('liked');
    }

    offUnlike(): void {
        this.socket!.off('unliked');
    }
}

export default SocketIoAdapter;
