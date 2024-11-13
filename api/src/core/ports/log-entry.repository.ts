import { LogEntry, LogEntryType } from 'src/core/models/log-entry.model';

export const LOG_ENTRY_REPOSITORY = 'log-entry.repository';

export type CreateLogEntryCommand = {
  type: LogEntryType;
  ownerId: string;
  metadata: any;
};

export type UpdateLogEntryCommand = {
  id: string;
  metadata: any;
};

export interface LogEntryRepository {
  findAllForUserId(userId: string): Promise<LogEntry[]>;
  ofId(id: string): Promise<LogEntry | null>;
  findAllOfTypeToday(type: LogEntryType): Promise<LogEntry[]>;
  create(command: CreateLogEntryCommand): Promise<LogEntry>;
  update(command: UpdateLogEntryCommand): Promise<LogEntry>;
  delete(id: string): Promise<void>;
}
