import { Prisma } from '@prisma/client';
import {
  LogEntry,
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
} from 'src/core/models/log-entry.model';

export const LogEntryInclude = Prisma.validator<Prisma.LogEntryInclude>()({});

export const LogEntryRelations = {
  include: LogEntryInclude,
};

export type LogEntrySnapshot = Prisma.LogEntryGetPayload<
  typeof LogEntryRelations
>;

export const logEntryMapper = (snapshot: LogEntrySnapshot): LogEntry => {
  const data = snapshot.metadata as {
    activityId: string;
    activityTitle: string;
    updatedCount: number;
    conversationId: string;
    content: string;
    duration: number;
    entryNumber: number;
    percentage: number;
    tandemFirstname: string;
    tandemLastname: string;
    partnerTandemId: string;
    vocabularyListId: string;
    vocabularyListName: string;
    title: string;
  };
  switch (snapshot.type) {
    case LogEntryType.CONNECTION:
      return new LogEntryConnection({
        id: snapshot.id,
        type: LogEntryType.CONNECTION,
        createdAt: snapshot.created_at,
      });
    case LogEntryType.VISIO:
      return new LogEntryVisio({
        id: snapshot.id,
        type: LogEntryType.VISIO,
        createdAt: snapshot.created_at,
        duration: data.duration,
        tandemFirstname: data.tandemFirstname,
        tandemLastname: data.tandemLastname,
        partnerTandemId: data.partnerTandemId,
      });
    case LogEntryType.TANDEM_CHAT:
      return new LogEntryTandemChat({
        id: snapshot.id,
        type: LogEntryType.TANDEM_CHAT,
        createdAt: snapshot.created_at,
        duration: data.duration,
        tandemFirstname: data.tandemFirstname,
        tandemLastname: data.tandemLastname,
        conversationId: data.conversationId,
      });
    case LogEntryType.COMMUNITY_CHAT:
      return new LogEntryCommunityChat({
        id: snapshot.id,
        type: LogEntryType.COMMUNITY_CHAT,
        createdAt: snapshot.created_at,
        conversationId: data.conversationId,
      });
    case LogEntryType.CUSTOM_ENTRY:
      return new LogEntryCustomEntry({
        id: snapshot.id,
        type: LogEntryType.CUSTOM_ENTRY,
        createdAt: snapshot.created_at,
        content: data.content,
        title: data.title,
      });
    case LogEntryType.PLAYED_GAME:
      return new LogEntryPlayedGame({
        id: snapshot.id,
        type: LogEntryType.PLAYED_GAME,
        createdAt: snapshot.created_at,
        percentage: data.percentage,
      });
    case LogEntryType.SHARING_LOGS:
      return new LogEntrySharingLogs({
        id: snapshot.id,
        type: LogEntryType.SHARING_LOGS,
        createdAt: snapshot.created_at,
      });
    case LogEntryType.SUBMIT_ACTIVITY:
      return new LogEntrySubmitActivity({
        id: snapshot.id,
        type: LogEntryType.SUBMIT_ACTIVITY,
        createdAt: snapshot.created_at,
        activityId: data.activityId,
        activityTitle: data.activityTitle,
        updatedCount: data.updatedCount,
      });
    case LogEntryType.EDIT_ACTIVITY:
      return new LogEntryEditActivity({
        id: snapshot.id,
        type: LogEntryType.EDIT_ACTIVITY,
        createdAt: snapshot.created_at,
        activityId: data.activityId,
        activityTitle: data.activityTitle,
        updatedCount: data.updatedCount,
      });
    case LogEntryType.ADD_VOCABULARY:
      return new LogEntryAddVocabulary({
        id: snapshot.id,
        type: LogEntryType.ADD_VOCABULARY,
        createdAt: snapshot.created_at,
        vocabularyListName: data.vocabularyListName,
        vocabularyListId: data.vocabularyListId,
        entryNumber: data.entryNumber,
      });
    case LogEntryType.SHARE_VOCABULARY:
      return new LogEntryShareVocabulary({
        id: snapshot.id,
        type: LogEntryType.SHARE_VOCABULARY,
        createdAt: snapshot.created_at,
        vocabularyListId: data.vocabularyListId,
        vocabularyListName: data.vocabularyListName,
      });
    default:
      throw new Error(`Unknown log entry type: ${snapshot.type}`);
  }
};
