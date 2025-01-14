import Conversation from '../domain/entities/chat/Conversation';
import LearningLanguage from '../domain/entities/LearningLanguage';
import LanguageCommand, { languageCommandToDomain } from './LanguageCommand';
import { MessageCommand, messageCommandToDomain } from './MessageCommand';
import UserChatCommand, { userChatCommandToDomain } from './UserChatCommand';

interface ConversationCommand {
    id: string;
    lastMessage?: MessageCommand;
    users: UserChatCommand[];
    isForCommunity: boolean;
    createdAt: string;
    metadata?: {
        isBlocked?: boolean;
        learningLanguages?: LearningLanguage[];
        centralLanguage?: LanguageCommand;
        partnerLanguage?: LanguageCommand;
    };
}

export const conversationCommandToDomain = (command: ConversationCommand) => {
    return new Conversation(
        command.id,
        command.users.map((user) => userChatCommandToDomain(user)),
        new Date(command.createdAt),
        command.lastMessage ? messageCommandToDomain(command.lastMessage) : undefined,
        command.isForCommunity,
        command.metadata?.isBlocked,
        command.metadata?.learningLanguages,
        command.metadata?.centralLanguage ? languageCommandToDomain(command.metadata.centralLanguage) : undefined,
        command.metadata?.partnerLanguage ? languageCommandToDomain(command.metadata.partnerLanguage) : undefined
    );
};

export default ConversationCommand;
