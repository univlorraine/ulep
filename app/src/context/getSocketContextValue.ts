import SocketIoAdapter from '../adapter/SocketIoAdapter';
import { SocketContextValueType } from './SocketContext';

interface GetSocketContextValueProps {
    socketChatUrl: string;
}

const getSocketContextValue = ({ socketChatUrl }: GetSocketContextValueProps): SocketContextValueType => {
    const socket = new SocketIoAdapter(socketChatUrl);
    return {
        socket,
    };
};

export default getSocketContextValue;
