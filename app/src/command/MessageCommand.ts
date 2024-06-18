import { UserMessage } from '../domain/entities/User';
import { Message, MessageType } from '../domain/entities/chat/Message';
import MediaObjectCommand from './MediaObjectCommand';

interface MessageUserCommand {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar?: MediaObjectCommand;
}

interface MessageCommand {
    id: string;
    content: string;
    conversationId: string;
    createdAt: Date;
    sender: MessageUserCommand;
    type: string;
}

export const messageCommandToDomain = (command: MessageCommand) => {
    return new Message(
        command.id,
        command.content,
        command.conversationId,
        command.createdAt,
        new UserMessage(
            command.sender.id,
            command.sender.firstname,
            command.sender.lastname,
            command.sender.email,
            command.sender.avatar
        ),
        command.type as MessageType
    );
};

export default MessageCommand;
