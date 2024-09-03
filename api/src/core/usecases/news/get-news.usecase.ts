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
    let news = await this.newsRepository.findAll();

    // For each item, gather title and content translations
    // and recover title and content language code
    news.items = news.items.map((item) => {
      const translations = [];
      item.title.translations.forEach((titleTranslation) => {
        translations.push({
          languageCode: titleTranslation.language,
          title: titleTranslation.content,
          content: item.content.translations.find(
            (contentTranslation) =>
              contentTranslation.language === titleTranslation.language,
          ).content,
        });
      });

      return {
        ...item,
        languageCode: item.title.language,
        translations,
      };
    });

    return news;
  }
}
