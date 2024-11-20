import { Collection, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  async findAllForUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Collection<LogEntry>> {
    const logEntries = await this.prisma.logEntry.findMany({
      where: { Owner: { id: userId } },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const count = await this.prisma.logEntry.count({
      where: { Owner: { id: userId } },
    });

    return {
      items: logEntries.map(logEntryMapper),
      totalItems: count,
    };
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
        created_at: command.createdAt ?? new Date(),
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
    const data: Prisma.LogEntryUpdateInput = {
      metadata: command.metadata,
    };

    if (command.createdAt) {
      data.created_at = command.createdAt;
    }

    const logEntry = await this.prisma.logEntry.update({
      where: { id: command.id },
      data,
    });

    return logEntryMapper(logEntry);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.logEntry.delete({
      where: { id },
    });
  }
}
