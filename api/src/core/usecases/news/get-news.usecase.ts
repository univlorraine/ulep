import { Inject, Injectable } from '@nestjs/common';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';

@Injectable()
export class GetNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
  ) {}

  async execute() {
    const news = await this.newsRepository.findAll();

    console.log({ newsUsecase: news.items[5].content.translations });

    /*         const newsWithTranslations = news.items.map((item) => ({
      item,
      translations: item.title.map((title) => {
        languageCode: title.language,
        title: title.content,
      })
    })) */

    // TODO : transform News to NewsWithTranslation

    return news;
  }
}
