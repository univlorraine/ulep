/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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

  async findAll(page: number, limit: number): Promise<Collection<LogEntry>> {
    const offset = (page - 1) * limit;

    const logEntries = await this.prisma.logEntry.findMany({
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit,
      ...LogEntryRelations,
    });

    const count = await this.prisma.logEntry.count();
    return new Collection({
      items: logEntries
        .map(logEntryMapper)
        .filter((entry) => entry !== undefined),
      totalItems: count,
    });
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
