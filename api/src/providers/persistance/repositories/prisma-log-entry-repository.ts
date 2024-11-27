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
  LogEntrySnapshot,
} from 'src/providers/persistance/mappers/log-entry.mapper';

@Injectable()
export class PrismaLogEntryRepository implements LogEntryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUserIdGroupedByDates(
    userId: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const offset = (page - 1) * limit;

    const distinctDatesWithCount = await this.prisma.$queryRaw<
      { date: Date; count: bigint }[]
    >`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM log_entry
    WHERE user_id = ${userId}
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

    const results = [];

    for (const { date, count } of distinctDatesWithCount) {
      const logEntries = await this.prisma.$queryRaw<LogEntrySnapshot[]>`
      SELECT *
      FROM log_entry
      WHERE user_id = ${userId} AND DATE(created_at) = ${date}
      ORDER BY created_at DESC
      LIMIT 3;
    `;

      results.push({
        date,
        count: Number(count),
        entries: logEntries.map(logEntryMapper),
      });
    }

    return results;
  }

  async findAllForUserIdByDate(
    userId: string,
    date: Date,
    page: number,
    limit: number,
  ): Promise<Collection<LogEntry>> {
    const offset = (page - 1) * limit;

    const logEntries = await this.prisma.logEntry.findMany({
      where: {
        Owner: { id: userId },
        created_at: { gte: startOfDay(date), lte: endOfDay(date) },
      },
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit,
    });

    const count = await this.prisma.logEntry.count({
      where: {
        Owner: { id: userId },
        created_at: { gte: startOfDay(date), lte: endOfDay(date) },
      },
    });

    return new Collection({
      items: logEntries.map(logEntryMapper),
      totalItems: count,
    });
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
