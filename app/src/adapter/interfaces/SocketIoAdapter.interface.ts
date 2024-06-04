import { Message } from '../../domain/entities/chat/Message';

interface SocketIoAdapterInterface {
    connect(): Promise<boolean>;
    disconnect(): Promise<boolean>;
    emit(message: Message): Promise<Message>;
}

export default SocketIoAdapterInterface;
