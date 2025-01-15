import { Collection, ModeQuery, PrismaService, SortOrder } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';
import { News } from 'src/core/models';
import { NewsRepository } from 'src/core/ports/news.repository';
import { CreateNewsCommand } from 'src/core/usecases/news/create-news.usecase';
import { UpdateNewsCommand } from 'src/core/usecases/news/update-news.usecase';
import { newsMapper, NewsRelations } from '../mappers/news.mapper';

@Injectable()
export class PrismaNewsRepository implements NewsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll({
    limit,
    offset,
    onlyActiveNews,
    where,
    orderBy,
  }): Promise<Collection<News>> {
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

    if (onlyActiveNews) {
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
    }

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
