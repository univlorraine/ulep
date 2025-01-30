import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { NewsStatus, NewsTranslation } from 'src/core/models';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  NewsRepository,
  NEWS_REPOSITORY,
} from 'src/core/ports/news.repository';

export type UpdateNewsCommand = {
  id: string;
  title: string;
  content: string;
  translations: NewsTranslation[];
  languageCode: string;
  status: NewsStatus;
  startPublicationDate: Date;
  endPublicationDate: Date;
  creditImage?: string;
  concernedUniversities?: string[];
};

@Injectable()
export class UpdateNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: UpdateNewsCommand) {
    const news = await this.newsRepository.ofId(command.id);
    if (!news) {
      throw new RessourceDoesNotExist('News does not exist');
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist('Language not found');
    }

    return this.newsRepository.update(command);
  }
}
