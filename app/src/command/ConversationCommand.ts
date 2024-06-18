import Conversation from '../domain/entities/chat/Conversation';
import MessageCommand, { messageCommandToDomain } from './MessageCommand';
import UserResult, { userResultToDomain } from './UserResult';

interface ConversationCommand {
    id: string;
    lastMessage: MessageCommand;
    participants: UserResult[];
    createdAt: string;
}

export const conversationCommandToDomain = (command: ConversationCommand) => {
    return new Conversation(
        command.id,
        messageCommandToDomain(command.lastMessage),
        command.participants.map((participant) => userResultToDomain(participant)),
        new Date(command.createdAt)
    );
};

export default ConversationCommand;
