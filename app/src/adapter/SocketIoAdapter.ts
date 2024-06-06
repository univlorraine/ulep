import { Message } from '../domain/entities/chat/Message';
import SocketIoAdapterInterface from './interfaces/SocketIoAdapter.interface';
import socketIo, { Socket } from 'socket.io-client';

class SocketIoAdapter implements SocketIoAdapterInterface {
    private accessToken?: string;
    private chatUrl: string;
    private socket: Socket | null = null;

    constructor(chatUrl: string, accessToken?: string) {
        this.accessToken = accessToken;
        this.chatUrl = chatUrl;
    }

    async connect(): Promise<boolean> {
        if (this.socket && this.socket.connected) {
            return true;
        }
        this.socket = await socketIo(this.chatUrl, { auth: { token: this.accessToken } });
        return this.socket?.connected;
    }

    async disconnect(): Promise<boolean> {
        if (this.socket && this.socket.connected) {
            await this.socket?.disconnect();
        }
        return !this.socket?.connected;
    }

    async emit(message: Message): Promise<Message> {
        await this.socket?.emit('publish', message);
        return message;
    }

    onMessage(handler: (message: Message) => void): void {
        this.socket?.on('message', handler);
    }

    offMessage(): void {
        this.socket?.off('message');
    }
}

export default SocketIoAdapter;
