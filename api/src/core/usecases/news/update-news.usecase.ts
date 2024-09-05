import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { MediaObject, NewsStatus, NewsTranslation } from 'src/core/models';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';

export type UpdateNewsCommand = {
  id: string;
  title: string;
  content: string;
  universityId: string;
  image?: MediaObject;
  translations: NewsTranslation[];
  languageCode: string;
  status: NewsStatus;
};

@Injectable()
export class UpdateNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
  ) {}

  async execute(command: UpdateNewsCommand) {
    const news = await this.newsRepository.ofId(command.id);
    if (!news) {
      throw new RessourceDoesNotExist();
    }

    return this.newsRepository.update(command);
  }
}
