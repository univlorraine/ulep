import { Collection } from '@app/common';
import { LogEntry, LogEntryType } from 'src/core/models/log-entry.model';

export const LOG_ENTRY_REPOSITORY = 'log-entry.repository';

export type CreateLogEntryCommand = {
  type: LogEntryType;
  learningLanguageId: string;
  metadata: any;
  createdAt?: Date;
};

export type UpdateLogEntryCommand = {
  id: string;
  metadata: any;
  createdAt?: Date;
};

export type LogEntriesByDates = {
  date: Date;
  count: number;
  entries: LogEntry[];
};

export interface LogEntryRepository {
  findAllForUserIdGroupedByDates(
    learningLanguageId: string,
    page: number,
    limit: number,
  ): Promise<LogEntriesByDates[]>;
  findAllForUserIdByDate(
    learningLanguageId: string,
    date: Date,
    page: number,
    limit: number,
  ): Promise<Collection<LogEntry>>;
  ofId(id: string): Promise<LogEntry | null>;
  findAllOfTypeToday(
    learningLanguageId: string,
    type: LogEntryType,
  ): Promise<LogEntry[]>;
  create(command: CreateLogEntryCommand): Promise<LogEntry>;
  update(command: UpdateLogEntryCommand): Promise<LogEntry>;
  delete(id: string): Promise<void>;
}
