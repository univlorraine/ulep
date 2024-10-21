import { Collection } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { News, NewsStatus } from 'src/core/models';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';
import { STORAGE_INTERFACE, StorageInterface } from 'src/core/ports/storage.interface';

export type GetNewsCommand = {
  page: number;
  limit: number;
  where: {
    title: string;
    universityIds: string[];
    status: NewsStatus;
    languageCodes: string[];
  };
};

@Injectable()
export class GetNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
  ) {}

  async execute(query: GetNewsCommand) {
    const { page, limit, where } = query;
    const offset = (page - 1) * limit;
    let news =  await this.newsRepository.findAll({
      offset,
      limit,
      where,
    });

    news = new Collection<News>({
      items: await this.fillNewsImageUrl(news.items),
      totalItems: news.totalItems,
    });

    return news;
  }

  private async fillNewsImageUrl(news: News[]) {
    const newsWithImageUrl: News[] = [];
    for (const currentNews of news) {
      if (currentNews.image) {
        const imageUrl = await this.storage.temporaryUrl(
          currentNews.image.bucket,
          currentNews.image.name,
          3600,
        );
        currentNews.imageURL = imageUrl;
      }
      newsWithImageUrl.push(currentNews);
    }
    return newsWithImageUrl;
  }
}
