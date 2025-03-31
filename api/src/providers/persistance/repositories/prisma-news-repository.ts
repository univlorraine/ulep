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

import { Collection, ModeQuery, PrismaService, SortOrder } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';
import { News, NewsStatus } from 'src/core/models';
import { NewsRepository } from 'src/core/ports/news.repository';
import { CreateNewsCommand } from 'src/core/usecases/news/create-news.usecase';
import { UpdateNewsCommand } from 'src/core/usecases/news/update-news.usecase';
import { newsMapper, NewsRelations } from '../mappers/news.mapper';

@Injectable()
export class PrismaNewsRepository implements NewsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll({ limit, offset, where, orderBy }): Promise<Collection<News>> {
    const wherePayload: Prisma.NewsWhereInput = where
      ? {
          Organization: {
            id: {
              in: where.universityIds,
            },
          },
          TitleTextContent: {
            text: {
              contains: where.title,
              mode: ModeQuery.INSENSITIVE,
            },
            ...(where.languageCodes && {
              OR: [
                {
                  LanguageCode: {
                    code: {
                      in: where.languageCodes,
                    },
                  },
                },
                {
                  Translations: {
                    some: {
                      LanguageCode: { code: { in: where.languageCodes } },
                    },
                  },
                },
              ],
            }),
          },
          status: where.status,
        }
      : {};

    const count = await this.prisma.news.count({
      where: wherePayload,
    });

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    let order = { updated_at: 'desc' as SortOrder } as any;

    if (orderBy) {
      if (orderBy.field === 'university_name') {
        order = { Organization: { name: orderBy.order } };
      } else if (orderBy.field === 'title') {
        order = { TitleTextContent: { text: orderBy.order } };
      } else if (orderBy.field === 'id') {
        order = { updated_at: 'desc' };
      } else {
        order = { [orderBy.field]: orderBy.order };
      }
    }

    const news = await this.prisma.news.findMany({
      where: wherePayload,
      include: NewsRelations,
      orderBy: order,
      skip: offset,
      take: limit,
    });

    return new Collection<News>({
      items: news.map(newsMapper),
      totalItems: count,
    });
  }

  async findAllForAnUser({ limit, offset, where }): Promise<Collection<News>> {
    const wherePayload: Prisma.NewsWhereInput = where
      ? {
          ConcernedUniversities: {
            some: {
              id: where.universityId,
            },
          },
          TitleTextContent: {
            text: {
              contains: where.title,
              mode: ModeQuery.INSENSITIVE,
            },
            ...(where.languageCodes && {
              OR: [
                {
                  LanguageCode: {
                    code: {
                      in: where.languageCodes,
                    },
                  },
                },
                {
                  Translations: {
                    some: {
                      LanguageCode: { code: { in: where.languageCodes } },
                    },
                  },
                },
              ],
            }),
          },
          status: NewsStatus.READY,
        }
      : {};

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Start publication date is before end of today
    wherePayload.start_publication_date = {
      lte: todayEnd,
    };
    // End publication date is after today
    wherePayload.end_publication_date = {
      gte: todayStart,
    };

    const count = await this.prisma.news.count({
      where: wherePayload,
    });

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    let order = { updated_at: 'desc' as SortOrder } as any;

    const news = await this.prisma.news.findMany({
      where: wherePayload,
      include: NewsRelations,
      orderBy: order,
      skip: offset,
      take: limit,
    });

    return new Collection<News>({
      items: news.map(newsMapper),
      totalItems: count,
    });
  }

  async ofId(id: string): Promise<News | null> {
    const news = await this.prisma.news.findUnique({
      where: { id },
      include: NewsRelations,
    });

    if (!news) {
      return null;
    }

    return newsMapper(news);
  }

  async create(command: CreateNewsCommand): Promise<News> {
    const news = await this.prisma.news.create({
      data: {
        Organization: {
          connect: {
            id: command.universityId,
          },
        },
        TitleTextContent: {
          create: {
            text: command.title,
            LanguageCode: { connect: { code: command.languageCode } },
            Translations: {
              create: command.translations?.map((translation) => ({
                text: translation.title,
                LanguageCode: { connect: { code: translation.languageCode } },
              })),
            },
          },
        },
        ContentTextContent: {
          create: {
            text: command.content,
            LanguageCode: { connect: { code: command.languageCode } },
            Translations: {
              create: command.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.languageCode } },
              })),
            },
          },
        },
        credit_image: command.creditImage,
        status: command.status,
        start_publication_date: command.startPublicationDate,
        end_publication_date: command.endPublicationDate,
        ConcernedUniversities: {
          connect: command.concernedUniversities?.map((university) => ({
            id: university,
          })),
        },
      },
      include: NewsRelations,
    });

    return newsMapper(news);
  }

  async update(command: UpdateNewsCommand): Promise<News> {
    await this.prisma.news.update({
      where: {
        id: command.id,
      },
      data: {
        TitleTextContent: {
          update: {
            text: command.title,
            LanguageCode: { connect: { code: command.languageCode } },
            Translations: {
              deleteMany: {},
              create: command.translations?.map((translation) => ({
                text: translation.title,
                LanguageCode: { connect: { code: translation.languageCode } },
              })),
            },
          },
        },
        ContentTextContent: {
          update: {
            text: command.content,
            LanguageCode: { connect: { code: command.languageCode } },
            Translations: {
              deleteMany: {},
              create: command.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.languageCode } },
              })),
            },
          },
        },
        credit_image: command.creditImage,
        status: command.status,
        start_publication_date: command.startPublicationDate,
        end_publication_date: command.endPublicationDate,
        ConcernedUniversities: {
          set: [],
          ...(command.concernedUniversities &&
            command.concernedUniversities.length > 0 && {
              connect: command.concernedUniversities.map((university) => ({
                id: university,
              })),
            }),
        },
      },
      include: NewsRelations,
    });

    const news = await this.prisma.news.findUnique({
      where: {
        id: command.id,
      },
      include: NewsRelations,
    });

    return newsMapper(news);
  }

  async delete(id: string): Promise<void> {
    const news = await this.prisma.news.findUnique({
      where: {
        id: id,
      },
      include: NewsRelations,
    });

    await this.prisma.news.delete({ where: { id } });

    await this.prisma.textContent.delete({
      where: { id: news.TitleTextContent.id },
    });
    await this.prisma.textContent.delete({
      where: { id: news.ContentTextContent.id },
    });
  }
}
