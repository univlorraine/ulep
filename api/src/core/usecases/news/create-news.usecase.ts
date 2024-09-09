import { Inject, Injectable } from '@nestjs/common';
import { MediaObject, NewsStatus, NewsTranslation } from 'src/core/models';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';

export type CreateNewsCommand = {
  title: string;
  content: string;
  universityId: string;
  image?: MediaObject;
  translations: NewsTranslation[];
  languageCode: string;
  status: NewsStatus;
};

@Injectable()
export class CreateNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
  ) {}

  async execute(command: CreateNewsCommand) {
    return this.newsRepository.create(command);
  }
}
