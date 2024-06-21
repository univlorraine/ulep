import { Message, MessageType, MessageWithoutSender } from '../domain/entities/chat/Message';
import UserChatCommand, { userChatCommandToDomain } from './UserChatCommand';

//From Domain api
export interface MessageCommand {
    id: string;
    content: string;
    createdAt: Date;
    user: UserChatCommand;
    type: string;
}

// From Chat api
export interface MessageWithoutSenderCommand extends MessageCommand {
    ownerId: string;
}

export const messageWithoutSenderCommandToDomain = (command: MessageWithoutSenderCommand) => {
    return new MessageWithoutSender(
        command.id,
        command.content,
        new Date(command.createdAt),
        command.ownerId,
        command.type as MessageType
    );
};

export const messageCommandToDomain = (command: MessageCommand) => {
    return new Message(
        command.id,
        command.content,
        new Date(command.createdAt),
        userChatCommandToDomain(command.user),
        command.type as MessageType
    );
};
