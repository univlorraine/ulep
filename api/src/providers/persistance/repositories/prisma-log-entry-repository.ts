import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import { LogEntry, LogEntryType } from 'src/core/models/log-entry.model';
import {
  CreateLogEntryCommand,
  LogEntryRepository,
  UpdateLogEntryCommand,
} from 'src/core/ports/log-entry.repository';
import { logEntryMapper } from 'src/providers/persistance/mappers/log-entry.mapper';

@Injectable()
export class PrismaLogEntryRepository implements LogEntryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUserId(userId: string): Promise<LogEntry[]> {
    const logEntries = await this.prisma.logEntry.findMany({
      where: { Owner: { id: userId } },
      orderBy: { created_at: 'asc' },
    });

    return logEntries.map(logEntryMapper);
  }
  async ofId(id: string): Promise<LogEntry | null> {
    const logEntry = await this.prisma.logEntry.findUnique({
      where: { id },
    });

    if (!logEntry) {
      return null;
    }

    return logEntryMapper(logEntry);
  }

  async findAllOfTypeToday(type: LogEntryType): Promise<LogEntry[]> {
    const logEntries = await this.prisma.logEntry.findMany({
      where: {
        type,
        created_at: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
      },
      orderBy: { created_at: 'asc' },
    });

    if (!logEntries) {
      return null;
    }

    return logEntries.map(logEntryMapper);
  }

  async create(command: CreateLogEntryCommand): Promise<LogEntry> {
    const logEntry = await this.prisma.logEntry.create({
      data: {
        type: command.type,
        metadata: command.metadata,
        Owner: {
          connect: {
            id: command.ownerId,
          },
        },
      },
    });

    return logEntryMapper(logEntry);
  }
  async update(command: UpdateLogEntryCommand): Promise<LogEntry> {
    const logEntry = await this.prisma.logEntry.update({
      where: { id: command.id },
      data: { metadata: command.metadata },
    });

    return logEntryMapper(logEntry);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.logEntry.delete({
      where: { id },
    });
  }
}
