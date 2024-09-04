import { Injectable, Logger } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { NewsRepository } from 'src/core/ports/news.repository';
import { newsMapper, NewsRelations } from '../mappers/news.mapper';
import { News, Translation } from 'src/core/models';
import { CreateNewsCommand } from 'src/core/usecases/news/create-news.usecase';

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
      },
      include: NewsRelations,
    });

    return newsMapper(news);
  }

  private readonly logger = new Logger(PrismaNewsRepository.name);
}
