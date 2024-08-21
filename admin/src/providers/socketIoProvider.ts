import socketIo, { Socket } from 'socket.io-client';
import { Message, MessageWithConversationId, UserChat } from '../entities/Message';
import jwtManager from './jwtManager';

class SocketIoProvider {
    private chatUrl: string;

    private socket: Socket | null = null;

    constructor(chatUrl: string) {
        this.chatUrl = chatUrl;
    }

    connect(): void {
        if (this.socket && this.socket.connected) {
            return;
        }
        const accessToken = jwtManager.getToken('access_token');
        this.socket = socketIo(this.chatUrl, { auth: { token: accessToken } });
    }

    disconnect(): void {
        if (this.socket && this.socket.connected) {
            this.socket.disconnect();
        }
    }

    emit(message: Message): Message {
        this.socket?.emit('publish', message);

        return message;
    }

    onMessage(conversationId: string, handler: (message: Message) => void): void {
        this.socket?.on('message', (message: MessageWithConversationId) => {
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
                    message.metadata
                )
            );
        });
    }

    offMessage(): void {
        this.socket?.off('message');
    }
}

export default SocketIoProvider;
