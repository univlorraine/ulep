import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  LogEntries,
  LogEntryAddVocabulary,
  LogEntryCommunityChat,
  LogEntryCustomEntry,
  LogEntryEditActivity,
  LogEntryPlayedGame,
  LogEntryShareVocabulary,
  LogEntrySubmitActivity,
  LogEntryTandemChat,
  LogEntryType,
  LogEntryVisio,
} from 'src/core/models/log-entry.model';

type LogEntryMetadataProps = {
  activityId?: string;
  activityTitle?: string;
  updatedCount?: number;
  conversationId?: string;
  content?: string;
  gameName?: string;
  title?: string;
  duration?: number;
  entryNumber?: number;
  percentage?: number;
  tandemFirstname?: string;
  tandemLastname?: string;
  vocabularyListId?: string;
  vocabularyListName?: string;
};

class LogEntryMetadataResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  activityId?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  activityTitle?: string;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  updatedCount?: number;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  conversationId?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  gameName?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  title?: string;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  duration?: number;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  entryNumber?: number;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  percentage?: number;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  tandemFirstname?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  tandemLastname?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  vocabularyListId?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  vocabularyListName?: string;

  constructor(partial: Partial<LogEntryMetadataResponse>) {
    Object.assign(this, partial);
  }

  static from(metadata: LogEntryMetadataProps): LogEntryMetadataResponse {
    return new LogEntryMetadataResponse(metadata);
  }
}

export class LogEntryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', enum: LogEntryType })
  @Expose({ groups: ['read'] })
  type: LogEntryType;

  @Swagger.ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'object' })
  @Expose({ groups: ['read'] })
  metadata: LogEntryMetadataResponse;

  constructor(partial: Partial<LogEntryResponse>) {
    Object.assign(this, partial);
  }

  static from(logEntry: LogEntries): LogEntryResponse {
    return new LogEntryResponse({
      id: logEntry.id,
      type: logEntry.type,
      createdAt: logEntry.createdAt,
      metadata: LogEntryMetadataResponse.from(
        LogEntryResponse.getMetadata(logEntry),
      ),
    });
  }

  private static getMetadata(logEntry: LogEntries): LogEntryMetadataProps {
    let metadata: LogEntryMetadataProps = {};

    if (logEntry instanceof LogEntryAddVocabulary) {
      metadata = {
        vocabularyListId: logEntry.vocabularyListName,
        vocabularyListName: logEntry.vocabularyListName,
        entryNumber: logEntry.entryNumber,
      };
    }

    if (logEntry instanceof LogEntryShareVocabulary) {
      metadata = {
        vocabularyListId: logEntry.vocabularyListId,
        vocabularyListName: logEntry.vocabularyListName,
      };
    }

    if (logEntry instanceof LogEntryVisio) {
      metadata = {
        duration: logEntry.duration,
        tandemFirstname: logEntry.tandemFirstname,
        tandemLastname: logEntry.tandemLastname,
      };
    }

    if (logEntry instanceof LogEntryTandemChat) {
      metadata = {
        conversationId: logEntry.conversationId,
        tandemFirstname: logEntry.tandemFirstname,
        tandemLastname: logEntry.tandemLastname,
      };
    }

    if (logEntry instanceof LogEntryCommunityChat) {
      metadata = {
        conversationId: logEntry.conversationId,
      };
    }

    if (logEntry instanceof LogEntryCustomEntry) {
      metadata = {
        content: logEntry.content,
        title: logEntry.title,
      };
    }

    if (logEntry instanceof LogEntryEditActivity) {
      metadata = {
        activityId: logEntry.activityId,
        activityTitle: logEntry.activityTitle,
      };
    }

    if (logEntry instanceof LogEntrySubmitActivity) {
      metadata = {
        activityId: logEntry.activityId,
        activityTitle: logEntry.activityTitle,
      };
    }

    if (logEntry instanceof LogEntryPlayedGame) {
      metadata = {
        gameName: logEntry.gameName,
        percentage: logEntry.percentage,
      };
    }

    return metadata;
  }
}
