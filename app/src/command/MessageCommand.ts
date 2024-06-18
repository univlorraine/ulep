import { UserChat } from '../domain/entities/User';
import { Message, MessageType } from '../domain/entities/chat/Message';
import UserChatCommand from './UserChatCommand';

interface MessageCommand {
    id: string;
    content: string;
    conversationId: string;
    createdAt: Date;
    sender: UserChatCommand;
    type: string;
}

export const messageCommandToDomain = (command: MessageCommand) => {
    return new Message(
        command.id,
        command.content,
        command.conversationId,
        command.createdAt,
        new UserChat(
            command.sender.id,
            command.sender.firstname,
            command.sender.lastname,
            command.sender.email,
            command.sender.isAdministrator,
            command.sender.avatar
        ),
        command.type as MessageType
    );
};

export default MessageCommand;
