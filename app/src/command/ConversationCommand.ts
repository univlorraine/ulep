import Conversation from '../domain/entities/chat/Conversation';
import LearningLanguage from '../domain/entities/LearningLanguage';
import { MessageCommand, messageCommandToDomain } from './MessageCommand';
import UserChatCommand, { userChatCommandToDomain } from './UserChatCommand';

interface ConversationCommand {
    id: string;
    lastMessage?: MessageCommand;
    users: UserChatCommand[];
    createdAt: string;
    metadata?: {
        isBlocked?: boolean;
        learningLanguages?: LearningLanguage[];
    };
}

export const conversationCommandToDomain = (command: ConversationCommand) => {
    return new Conversation(
        command.id,
        command.users.map((user) => userChatCommandToDomain(user)),
        new Date(command.createdAt),
        command.lastMessage ? messageCommandToDomain(command.lastMessage) : undefined,
        command.metadata?.isBlocked,
        command.metadata?.learningLanguages
    );
};

export default ConversationCommand;
