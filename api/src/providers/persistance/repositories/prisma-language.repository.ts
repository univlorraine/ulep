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
import { Language, LanguageStatus, SuggestedLanguage } from 'src/core/models';
import {
  LanguageFilters,
  LanguagePagination,
  LanguageQueryOrderBy,
  LanguageRepository,
  LanguageStatusFilter,
  SuggestedLanguageQueryOrderBy,
} from 'src/core/ports/language.repository';
import { languageMapper } from '../mappers/language.mapper';
import {
  suggestedLanguageMapper,
  SuggestedLanguageRelations,
} from '../mappers/suggestedLanguage.mapper';

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
    status: LanguageStatusFilter,
    pagination: LanguagePagination,
    filters?: LanguageFilters,
  ): Promise<Collection<Language>> {
    const where: any = {};

    if (filters?.code) {
      where.code = {
        contains: filters.code,
        mode: 'insensitive',
      };
    }

    if (filters?.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (status === 'PARTNER') {
      where.secondaryUniversityActive = true;
    } else if (status) {
      where.mainUniversityStatus = status;
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

  async deleteAllRequestFromLanguage(code: string): Promise<void> {
    await this.prisma.suggestedLanguages.deleteMany({
      where: { LanguageCode: { code: code } },
    });
  }
}
