import { Message, MessageType, MessageWithoutSender } from '../domain/entities/chat/Message';
import { ActivityCommand, activityCommandToDomain } from './ActivityCommand';
import UserChatCommand, { userChatCommandToDomain } from './UserChatCommand';
import VocabularyListCommand, { vocabularyListCommandToDomain } from './VocabularyListCommand';

interface MessageMetadataCommand {
    activity?: ActivityCommand;
    vocabularyList?: VocabularyListCommand;
    openGraphResult?: any;
}
//From Domain api
export interface MessageCommand {
    id: string;
    content: string;
    createdAt: Date;
    user: UserChatCommand;
    type: string;
    metadata: any;
    likes: number;
    didLike: boolean;
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
        command.type as MessageType,
        command.likes,
        command.didLike,
        {
            ...command.metadata,
            activity: command.metadata.activity ? activityCommandToDomain(command.metadata.activity) : undefined,
            vocabularyList: command.metadata.vocabularyList
                ? vocabularyListCommandToDomain(command.metadata.vocabularyList)
                : undefined,
        }
    );
};

export const messageCommandToDomain = (command: MessageCommand) => {
    return new Message(
        command.id,
        command.content,
        new Date(command.createdAt),
        userChatCommandToDomain(command.user),
        command.type as MessageType,
        command.likes,
        command.didLike,
        {
            ...command.metadata,
            activity: command.metadata.activity ? activityCommandToDomain(command.metadata.activity) : undefined,
            vocabularyList: command.metadata.vocabularyList
                ? vocabularyListCommandToDomain(command.metadata.vocabularyList)
                : undefined,
        }
    );
};
