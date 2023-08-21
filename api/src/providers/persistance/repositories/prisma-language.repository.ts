import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { Language, SuggestedLanguage } from 'src/core/models';
import {
  LanguageRepository,
  SuggestedLanguageQueryOrderBy,
} from 'src/core/ports/language.repository';
import {
  SuggestedLanguageRelations,
  languageMapper,
  suggestedLanguageMapper,
} from '../mappers/language.mapper';

type CountAllSuggestedLanguagesResult = {
  id: string;
  name: string;
  code: string;
  count: number;
};

@Injectable()
export class PrismaLanguageRepository implements LanguageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async allRequests(
    offset?: number,
    limit?: number,
    orderBy?: SuggestedLanguageQueryOrderBy,
  ): Promise<Collection<SuggestedLanguage>> {
    const count = await this.prisma.suggestedLanguages.count();

    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    let order;
    if (orderBy.field === 'code') {
      order = { LanguageCode: { [orderBy.field]: orderBy.order } };
    } else {
      order = { User: { [orderBy.field]: orderBy.order } };
    }

    const suggestedLanguages = await this.prisma.suggestedLanguages.findMany({
      skip: offset,
      orderBy: order,
      take: limit,
      include: SuggestedLanguageRelations,
    });

    return new Collection<SuggestedLanguage>({
      items: suggestedLanguages.map(suggestedLanguageMapper),
      totalItems: count,
    });
  }

  async countAllRequests(
    offset?: number,
    limit?: number,
  ): Promise<Collection<{ language: Language; count: number }>> {
    const countResult: { count: number }[] = await this.prisma.$queryRaw`
    SELECT COUNT(*) as count FROM (
        SELECT s.language_code_id
        FROM suggested_languages s
        JOIN language_codes l ON s.language_code_id = l.id
        GROUP BY l.id, s.language_code_id
    ) as groupedLanguages
`;

    const results: CountAllSuggestedLanguagesResult[] = await this.prisma
      .$queryRaw`
    SELECT l.id, l.name, l.code, COUNT(s.language_code_id) as count
    FROM suggested_languages s
    JOIN language_codes l ON s.language_code_id = l.id
    GROUP BY l.id
    ORDER BY count ASC
    LIMIT ${limit} OFFSET ${offset}
`;

    return new Collection<{ language: Language; count: number }>({
      items: results.map((result) => ({
        language: new Language({
          id: result.id,
          name: result.name,
          code: result.code,
        }),
        count: Number(result.count),
      })),
      totalItems: Number(countResult[0].count),
    });
  }

  async ofId(id: string): Promise<Language> {
    const languageCode = await this.prisma.languageCodes.findUnique({
      where: { id },
    });

    if (!languageCode) {
      return null;
    }

    return languageMapper(languageCode);
  }

  async ofCode(code: string): Promise<Language> {
    const languageCode = await this.prisma.languageCodes.findUnique({
      where: { code },
    });

    if (!languageCode) {
      return null;
    }

    return languageMapper(languageCode);
  }

  async all(): Promise<Collection<Language>> {
    const count = await this.prisma.languageCodes.count();

    const languageCodes = await this.prisma.languageCodes.findMany();

    return new Collection<Language>({
      items: languageCodes.map(languageMapper),
      totalItems: count,
    });
  }

  async addRequest(code: string, userId: string): Promise<void> {
    await this.prisma.suggestedLanguages.create({
      data: {
        LanguageCode: { connect: { code } },
        User: { connect: { id: userId } },
      },
    });
  }

  async countRequests(code: string): Promise<number> {
    const count = await this.prisma.suggestedLanguages.count({
      where: { language_code_id: code },
    });

    return count;
  }
}
