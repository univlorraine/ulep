import { Injectable, Logger } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { NewsRepository } from 'src/core/ports/news.repository';
import { newsMapper } from '../mappers/news.mapper';
import { News } from 'src/core/models';
import { CreateNewsCommand } from 'src/core/usecases/news/create-news.usecase';

@Injectable()
export class PrismaNewsRepository implements NewsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(): Promise<Collection<News>> {
    const count = await this.prisma.news.count({});
    const news = await this.prisma.news.findMany({});

    console.log({ news });

    return new Collection<News>({
      items: news.map(newsMapper),
      totalItems: count,
    });
  }

  async create(command: CreateNewsCommand): Promise<News> {
    const news = await this.prisma.news.create({
      data: {
        ...command,
      },
    });

    return newsMapper(news);
  }

  private readonly logger = new Logger(PrismaNewsRepository.name);
}
