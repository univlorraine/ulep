import { Injectable, Logger } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { NewsRepository } from 'src/core/ports/news.repository';
import { newsMapper, NewsRelations } from '../mappers/news.mapper';
import { News, Translation } from 'src/core/models';
import { CreateNewsCommand } from 'src/core/usecases/news/create-news.usecase';
import { UpdateNewsCommand } from 'src/core/usecases/news/update-news.usecase';

@Injectable()
export class PrismaNewsRepository implements NewsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(): Promise<Collection<News>> {
    const count = await this.prisma.news.count({});
    const news = await this.prisma.news.findMany({
      include: NewsRelations,
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
    const titleTranslations: Translation[] = command.translations?.map(
      (translation) => ({
        language: translation.languageCode,
        content: translation.title,
      }),
    );

    const contentTranslations: Translation[] = command.translations?.map(
      (translation) => ({
        language: translation.languageCode,
        content: translation.content,
      }),
    );

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
              create: titleTranslations.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.language } },
              })),
            },
          },
        },
        ContentTextContent: {
          create: {
            text: command.content,
            LanguageCode: { connect: { code: command.languageCode } },
            Translations: {
              create: contentTranslations.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.language } },
              })),
            },
          },
        },
        status: command.status,
      },
      include: NewsRelations,
    });

    return newsMapper(news);
  }

  async update(command: UpdateNewsCommand): Promise<News> {
    const titleTranslations: Translation[] = command.translations?.map(
      (translation) => ({
        language: translation.languageCode,
        content: translation.title,
      }),
    );

    const contentTranslations: Translation[] = command.translations?.map(
      (translation) => ({
        language: translation.languageCode,
        content: translation.content,
      }),
    );

    console.log({ contentTranslations });

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
              create: titleTranslations.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.language } },
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
              create: contentTranslations.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.language } },
              })),
            },
          },
        },
        status: command.status,
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

  private readonly logger = new Logger(PrismaNewsRepository.name);
}
