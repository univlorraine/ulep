import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { NewsRepository } from 'src/core/ports/news.repository';
import { newsMapper, NewsRelations } from '../mappers/news.mapper';
import { News } from 'src/core/models';
import { CreateNewsCommand } from 'src/core/usecases/news/create-news.usecase';
import { UpdateNewsCommand } from 'src/core/usecases/news/update-news.usecase';

@Injectable()
export class PrismaNewsRepository implements NewsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll({ limit, offset, where }): Promise<Collection<News>> {
    const wherePayload = where
      ? {
          Organization: {
            id: where.universityId,
          },
          TitleTextContent: {
            text: {
              contains: where.title,
            },
            ...(where.languageCode && {
              OR: [
                {
                  LanguageCode: {
                    code: where.languageCode,
                  },
                },
                {
                  Translations: {
                    some: {
                      LanguageCode: { code: where.languageCode },
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

    const news = await this.prisma.news.findMany({
      where: wherePayload,
      include: NewsRelations,
      orderBy: {
        updated_at: 'desc',
      },
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
        Organization: {
          connect: {
            id: command.universityId,
          },
        },
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
