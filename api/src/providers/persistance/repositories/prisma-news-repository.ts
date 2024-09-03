import { Injectable, Logger } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { NewsRepository } from 'src/core/ports/news.repository';
import { newsMapper, NewsRelations } from '../mappers/news.mapper';
import { News } from 'src/core/models';
import { CreateNewsCommand } from 'src/core/usecases/news/create-news.usecase';

@Injectable()
export class PrismaNewsRepository implements NewsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(): Promise<Collection<News>> {
    const count = await this.prisma.news.count({});
    const news = await this.prisma.news.findMany({
      include: NewsRelations,
    });

    console.log({ prismaNews: news });
    console.log({ prismaTrad: news[5].ContentTextContent.Translations });

    return new Collection<News>({
      items: news.map(newsMapper),
      totalItems: count,
    });
  }

  async create(command: News): Promise<News> {
    const news = await this.prisma.news.create({
      data: {
        Organization: {
          connect: {
            id: command.universityId,
          },
        },
        TitleTextContent: {
          create: {
            id: command.title.id,
            text: command.title.content,
            LanguageCode: { connect: { code: command.title.language } },
            Translations: {
              create: command.title.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.language } },
              })),
            },
          },
        },
        ContentTextContent: {
          create: {
            id: command.content.id,
            text: command.content.content,
            LanguageCode: { connect: { code: command.content.language } },
            Translations: {
              create: command.content.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.language } },
              })),
            },
          },
        },
      },
      include: NewsRelations,
    });

    console.log({ news });

    return newsMapper(news);
  }

  private readonly logger = new Logger(PrismaNewsRepository.name);
}
