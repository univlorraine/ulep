import { createContext, useContext } from 'react';
import SocketIoAdapterInterface from '../adapter/interfaces/SocketIoAdapter.interface';
import getSocketContextValue from './getSocketContextValue';

export interface SocketContextValueType {
    socket: SocketIoAdapterInterface;
}

export const SocketContext = createContext<SocketContextValueType>(getSocketContextValue({ socketChatUrl: '' }));

export const useSocket = () => useContext(SocketContext);
