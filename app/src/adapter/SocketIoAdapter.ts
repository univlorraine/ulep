import socketIo, { Socket } from 'socket.io-client';
import { UserChat } from '../domain/entities/User';
import { Message, MessageWithConversationId } from '../domain/entities/chat/Message';
import SocketIoAdapterInterface from './interfaces/SocketIoAdapter.interface';

class SocketIoAdapter implements SocketIoAdapterInterface {
    private chatUrl: string;
    private socket: Socket | null = null;

    constructor(chatUrl: string) {
        this.chatUrl = chatUrl;
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

    emit(message: Message): Message {
        this.socket?.emit('publish', message);
        return message;
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
                    message.metadata
                )
            );
        });
    }

    offMessage(): void {
        this.socket!.off('message');
    }
}

export default SocketIoAdapter;
