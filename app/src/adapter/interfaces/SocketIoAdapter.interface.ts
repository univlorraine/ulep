import { Message } from '../../domain/entities/chat/Message';

interface SocketIoAdapterInterface {
    connect(): Promise<boolean>;
    disconnect(): Promise<boolean>;
    emit(message: Message): Promise<Message>;
    offMessage(): void;
    onMessage(handler: (message: Message) => void): void;
}

export default SocketIoAdapterInterface;
