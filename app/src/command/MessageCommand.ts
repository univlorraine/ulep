import { UserChat } from '../domain/entities/User';
import { Message, MessageType } from '../domain/entities/chat/Message';
import UserChatCommand, { userChatCommandToDomain } from './UserChatCommand';

interface MessageCommand {
    id: string;
    content: string;
    createdAt: Date;
    user: UserChatCommand;
    type: string;
}

export const messageCommandToDomain = (command: MessageCommand) => {
    return new Message(
        command.id,
        command.content,
        new Date(command.createdAt),
        userChatCommandToDomain(command.user),
        command.type as MessageType
    );
};

export default MessageCommand;
