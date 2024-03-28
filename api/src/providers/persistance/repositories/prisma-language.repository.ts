import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { Language, LanguageStatus, SuggestedLanguage } from 'src/core/models';
import {
  LanguageFilter,
  LanguagePagination,
  LanguageQueryOrderBy,
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
  mainUniversityStatus: LanguageStatus;
  secondaryUniversityActive: boolean;
  isDiscovery: boolean;
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
    SELECT l.id, l.name, l.code, l."isDiscovery", COUNT(s.language_code_id) as count
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
          mainUniversityStatus: result.mainUniversityStatus,
          secondaryUniversityActive: result.secondaryUniversityActive,
          isDiscovery: result.isDiscovery,
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

  async all(
    orderBy: LanguageQueryOrderBy,
    status: LanguageFilter,
    pagination: LanguagePagination,
  ): Promise<Collection<Language>> {
    let where;
    if (status === 'PARTNER') {
      where = { secondaryUniversityActive: true };
    } else if (status) {
      where = { mainUniversityStatus: status };
    }

    const count = await this.prisma.languageCodes.count({
      where,
    });

    let offset: number | undefined;
    let limit: number | undefined;

    if (pagination) {
      limit = pagination.limit;
      const page = pagination.page;
      offset = page > 0 ? (page - 1) * limit : 0;
    }

    const languageCodes = await this.prisma.languageCodes.findMany({
      take: limit,
      skip: offset,
      where,
      orderBy: orderBy ? { [orderBy.field]: orderBy.order } : undefined,
    });

    return new Collection<Language>({
      items: languageCodes.map(languageMapper),
      totalItems: count,
    });
  }

  async addRequest(code: string, userId: string): Promise<void> {
    const languageCode = await this.prisma.languageCodes.findUnique({
      where: { code },
    });

    if (!languageCode) return;

    const suggestedLanguages = await this.prisma.suggestedLanguages.findUnique({
      where: {
        language_code_id_user_id: {
          language_code_id: languageCode.id,
          user_id: userId,
        },
      },
    });

    if (suggestedLanguages) return;

    await this.prisma.suggestedLanguages.create({
      data: {
        LanguageCode: { connect: { code } },
        User: { connect: { id: userId } },
      },
    });
  }

  async countRequests(code: string): Promise<number> {
    const count = await this.prisma.suggestedLanguages.count({
      where: { LanguageCode: { code: code } },
    });

    return count;
  }

  async update(language: Language): Promise<Language> {
    await this.prisma.languageCodes.update({
      where: { id: language.id },
      data: {
        mainUniversityStatus: language.mainUniversityStatus,
        secondaryUniversityActive: language.secondaryUniversityActive,
        isDiscovery: language.isDiscovery,
      },
    });

    const updateLanguage = await this.prisma.languageCodes.findUnique({
      where: { id: language.id },
    });

    return languageMapper(updateLanguage);
  }

  async getLanguagesProposedToLearning(): Promise<Language[]> {
    const res = await this.prisma.languageCodes.findMany({
      where: {
        mainUniversityStatus: {
          in: [LanguageStatus.PRIMARY, LanguageStatus.SECONDARY],
        },
      },
    });
    return res.map(languageMapper);
  }

  async getLanguagesSuggestedByUser(
    userId: string,
  ): Promise<SuggestedLanguage[]> {
    const res = await this.prisma.suggestedLanguages.findMany({
      where: {
        user_id: userId,
      },
      include: SuggestedLanguageRelations,
    });

    return res.map(suggestedLanguageMapper);
  }
}
