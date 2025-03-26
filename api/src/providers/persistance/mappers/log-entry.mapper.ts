import { Prisma } from '@prisma/client';
import {
  LogEntry,
  LogEntryAddVocabulary,
  LogEntryCommunityChat,
  LogEntryCustomEntry,
  LogEntryEditActivity,
  LogEntryPlayedGame,
  LogEntryPublishActivity,
  LogEntryShareVocabulary,
  LogEntrySharingLogs,
  LogEntrySharingLogsForResearch,
  LogEntrySubmitActivity,
  LogEntryTandemChat,
  LogEntryType,
  LogEntryVisio,
} from 'src/core/models/log-entry.model';
import {
  learningLanguageMapper,
  LearningLanguageRelations,
  LearningLanguageSnapshot,
} from 'src/providers/persistance/mappers/learningLanguage.mapper';

export const LogEntryInclude = Prisma.validator<Prisma.LogEntryInclude>()({
  LearningLanguage: { include: LearningLanguageRelations },
});

export const LogEntryRelations = {
  include: LogEntryInclude,
};

export type LogEntrySnapshot = Prisma.LogEntryGetPayload<
  typeof LogEntryRelations
> & {
  LearningLanguage: LearningLanguageSnapshot;
};

export const logEntryMapper = (
  snapshot: LogEntrySnapshot,
): LogEntry | undefined => {
  const data = snapshot.metadata as {
    activityId: string;
    activityTitle: string;
    updatedCount: number;
    conversationId: string;
    content: string;
    gameName: string;
    duration: number;
    entryNumber: number;
    percentage: number;
    tandemFirstname: string;
    tandemLastname: string;
    partnerTandemId: string;
    vocabularyListId: string;
    vocabularyListName: string;
    title: string;
    roomName: string;
  };
  switch (snapshot.type) {
    case LogEntryType.VISIO:
      return new LogEntryVisio({
        id: snapshot.id,
        type: LogEntryType.VISIO,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        duration: data.duration,
        tandemFirstname: data.tandemFirstname,
        tandemLastname: data.tandemLastname,
        partnerTandemId: data.partnerTandemId,
        roomName: data.roomName,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.TANDEM_CHAT:
      return new LogEntryTandemChat({
        id: snapshot.id,
        type: LogEntryType.TANDEM_CHAT,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        duration: data.duration,
        tandemFirstname: data.tandemFirstname,
        tandemLastname: data.tandemLastname,
        conversationId: data.conversationId,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.COMMUNITY_CHAT:
      return new LogEntryCommunityChat({
        id: snapshot.id,
        type: LogEntryType.COMMUNITY_CHAT,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        conversationId: data.conversationId,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.CUSTOM_ENTRY:
      return new LogEntryCustomEntry({
        id: snapshot.id,
        type: LogEntryType.CUSTOM_ENTRY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        content: data.content,
        title: data.title,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.PLAYED_GAME:
      return new LogEntryPlayedGame({
        id: snapshot.id,
        type: LogEntryType.PLAYED_GAME,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        percentage: data.percentage,
        gameName: data.gameName,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.SHARING_LOGS:
      return new LogEntrySharingLogs({
        id: snapshot.id,
        type: LogEntryType.SHARING_LOGS,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.SHARING_LOGS_FOR_RESEARCH:
      return new LogEntrySharingLogsForResearch({
        id: snapshot.id,
        type: LogEntryType.SHARING_LOGS_FOR_RESEARCH,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.SUBMIT_ACTIVITY:
      return new LogEntrySubmitActivity({
        id: snapshot.id,
        type: LogEntryType.SUBMIT_ACTIVITY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        activityId: data.activityId,
        activityTitle: data.activityTitle,
        updatedCount: data.updatedCount,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.PUBLISH_ACTIVITY:
      return new LogEntryPublishActivity({
        id: snapshot.id,
        type: LogEntryType.PUBLISH_ACTIVITY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        activityId: data.activityId,
        activityTitle: data.activityTitle,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.EDIT_ACTIVITY:
      return new LogEntryEditActivity({
        id: snapshot.id,
        type: LogEntryType.EDIT_ACTIVITY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        activityId: data.activityId,
        activityTitle: data.activityTitle,
        updatedCount: data.updatedCount,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.ADD_VOCABULARY:
      return new LogEntryAddVocabulary({
        id: snapshot.id,
        type: LogEntryType.ADD_VOCABULARY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        vocabularyListName: data.vocabularyListName,
        vocabularyListId: data.vocabularyListId,
        entryNumber: data.entryNumber,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    case LogEntryType.SHARE_VOCABULARY:
      return new LogEntryShareVocabulary({
        id: snapshot.id,
        type: LogEntryType.SHARE_VOCABULARY,
        createdAt: snapshot.created_at,
        updatedAt: snapshot.updated_at,
        vocabularyListId: data.vocabularyListId,
        vocabularyListName: data.vocabularyListName,
        learningLanguage: learningLanguageMapper(snapshot.LearningLanguage),
      });
    default:
      return undefined;
  }
};
