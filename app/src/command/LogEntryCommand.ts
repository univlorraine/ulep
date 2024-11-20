import {
    LogEntryAddVocabulary,
    LogEntryCommunityChat,
    LogEntryConnection,
    LogEntryCustomEntry,
    LogEntryEditActivity,
    LogEntryPlayedGame,
    LogEntryShareVocabulary,
    LogEntrySharingLogs,
    LogEntrySubmitActivity,
    LogEntryTandemChat,
    LogEntryType,
    LogEntryVisio,
} from '../domain/entities/LogEntry';

interface LogEntryMetadata {
    activityId?: string;
    updatedCount?: number;
    conversationId?: string;
    content?: string;
    duration?: number;
    entryNumber?: number;
    percentage?: number;
    tandemFirstname?: string;
    tandemLastname?: string;
    vocabularyListId?: string;
    vocabularyListName?: string;
    title?: string;
}

interface LogEntryCommand {
    id: string;
    createdAt: Date;
    type: string;
    ownerId: string;
    metadata: LogEntryMetadata;
}

export const logEntryCommandToDomain = (command: LogEntryCommand) => {
    switch (command.type) {
        case LogEntryType.ADD_VOCABULARY:
            return new LogEntryAddVocabulary({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                vocabularyListId: command.metadata.vocabularyListId!,
                vocabularyListName: command.metadata.vocabularyListName!,
                entryNumber: command.metadata.entryNumber!,
            });
        case LogEntryType.SHARE_VOCABULARY:
            return new LogEntryShareVocabulary({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                vocabularyListId: command.metadata.vocabularyListId!,
                vocabularyListName: command.metadata.vocabularyListName!,
            });
        case LogEntryType.COMMUNITY_CHAT:
            return new LogEntryCommunityChat({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                conversationId: command.metadata.conversationId!,
            });
        case LogEntryType.CONNECTION:
            return new LogEntryConnection({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
            });
        case LogEntryType.CUSTOM_ENTRY:
            return new LogEntryCustomEntry({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                content: command.metadata.content!,
                title: command.metadata.title!,
            });
        case LogEntryType.EDIT_ACTIVITY:
            return new LogEntryEditActivity({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                activityId: command.metadata.activityId!,
                updatedCount: command.metadata.updatedCount!,
            });
        case LogEntryType.PLAYED_GAME:
            return new LogEntryPlayedGame({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                percentage: command.metadata.percentage!,
            });
        case LogEntryType.SHARING_LOGS:
            return new LogEntrySharingLogs({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
            });
        case LogEntryType.SUBMIT_ACTIVITY:
            return new LogEntrySubmitActivity({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                activityId: command.metadata.activityId!,
            });
        case LogEntryType.TANDEM_CHAT:
            return new LogEntryTandemChat({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                conversationId: command.metadata.conversationId!,
                tandemFirstname: command.metadata.tandemFirstname!,
                tandemLastname: command.metadata.tandemLastname!,
            });
        case LogEntryType.VISIO:
            return new LogEntryVisio({
                id: command.id,
                createdAt: command.createdAt,
                type: command.type,
                ownerId: command.ownerId,
                duration: command.metadata.duration!,
                tandemFirstname: command.metadata.tandemFirstname!,
                tandemLastname: command.metadata.tandemLastname!,
            });
        default:
            throw new Error(`Unknown log entry type: ${command.type}`);
    }
};

export default LogEntryCommand;
