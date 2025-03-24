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
import {
  logEntryMapper,
  LogEntryRelations,
} from 'src/providers/persistance/mappers/log-entry.mapper';

@Injectable()
export class PrismaLogEntryRepository implements LogEntryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForLearningLanguageGroupedByDates(
    learningLanguageId: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const offset = (page - 1) * limit;
    const distinctDatesWithCount = await this.prisma.$queryRaw<
      { date: Date; count: bigint }[]
    >`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM log_entry
    WHERE learning_language_id = ${learningLanguageId}
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

    const results = [];

    for (const { date, count } of distinctDatesWithCount) {
      const logEntries = await this.prisma.logEntry.findMany({
        where: {
          LearningLanguage: { id: learningLanguageId },
          created_at: { gte: startOfDay(date), lte: endOfDay(date) },
        },
        orderBy: { created_at: 'desc' },
        take: 3,
        ...LogEntryRelations,
      });

      results.push({
        date,
        count: Number(count),
        entries: logEntries
          .map(logEntryMapper)
          .filter((entry) => entry !== undefined),
      });
    }

    return results;
  }

  async findAllForLearningLanguageByDate(
    learningLanguageId: string,
    date: Date,
    page: number,
    limit: number,
  ): Promise<Collection<LogEntry>> {
    const offset = (page - 1) * limit;
    const startOfDayDate = startOfDay(date);
    const endOfDayDate = endOfDay(date);

    const logEntries = await this.prisma.logEntry.findMany({
      where: {
        AND: [
          { LearningLanguage: { id: learningLanguageId } },
          { created_at: { gte: startOfDayDate, lte: endOfDayDate } },
        ],
      },
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit,
      ...LogEntryRelations,
    });

    const count = await this.prisma.logEntry.count({
      where: {
        LearningLanguage: { id: learningLanguageId },
        created_at: { gte: startOfDay(date), lte: endOfDay(date) },
      },
    });

    return new Collection({
      items: logEntries
        .map(logEntryMapper)
        .filter((entry) => entry !== undefined),
      totalItems: count,
    });
  }

  async findAllForLearningLanguage(
    learningLanguageId: string,
    beforeDate: Date,
  ): Promise<LogEntry[]> {
    const endOfDayDate = endOfDay(beforeDate);

    const logEntries = await this.prisma.logEntry.findMany({
      where: {
        AND: [
          { LearningLanguage: { id: learningLanguageId } },
          { created_at: { lte: endOfDayDate } },
        ],
      },
      orderBy: { created_at: 'desc' },
      ...LogEntryRelations,
    });

    return logEntries
      .map(logEntryMapper)
      .filter((entry) => entry !== undefined);
  }

  async ofId(id: string): Promise<LogEntry | null> {
    const logEntry = await this.prisma.logEntry.findUnique({
      where: { id },
      ...LogEntryRelations,
    });

    if (!logEntry) {
      return null;
    }

    return logEntryMapper(logEntry);
  }

  async findAllOfTypeToday(
    learningLangugageId: string,
    type: LogEntryType,
  ): Promise<LogEntry[]> {
    const logEntries = await this.prisma.logEntry.findMany({
      where: {
        type,
        LearningLanguage: { id: learningLangugageId },
        created_at: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
      },
      orderBy: { created_at: 'asc' },
      ...LogEntryRelations,
    });

    if (!logEntries) {
      return null;
    }

    return logEntries
      .map(logEntryMapper)
      .filter((entry) => entry !== undefined);
  }

  async findAllOfTypeTodayWithoutLearningLanguage(
    type: LogEntryType,
  ): Promise<LogEntry[]> {
    const logEntries = await this.prisma.logEntry.findMany({
      where: {
        type,
        created_at: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
      },
      orderBy: { created_at: 'asc' },
      ...LogEntryRelations,
    });

    if (!logEntries) {
      return null;
    }

    return logEntries
      .map(logEntryMapper)
      .filter((entry) => entry !== undefined);
  }

  async create(command: CreateLogEntryCommand): Promise<LogEntry> {
    const logEntry = await this.prisma.logEntry.create({
      data: {
        type: command.type,
        metadata: command.metadata,
        created_at: command.createdAt ?? new Date(),
        LearningLanguage: {
          connect: {
            id: command.learningLanguageId,
          },
        },
      },
      ...LogEntryRelations,
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
      ...LogEntryRelations,
    });

    return logEntryMapper(logEntry);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.logEntry.delete({
      where: { id },
    });
  }
}
