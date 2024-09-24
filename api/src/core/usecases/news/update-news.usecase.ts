import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { NewsStatus, NewsTranslation } from 'src/core/models';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

export type UpdateNewsCommand = {
  id: string;
  title: string;
  content: string;
  universityId: string;
  translations: NewsTranslation[];
  languageCode: string;
  status: NewsStatus;
};

@Injectable()
export class UpdateNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: UpdateNewsCommand) {
    const news = await this.newsRepository.ofId(command.id);
    if (!news) {
      throw new RessourceDoesNotExist('News does not exist');
    }

    const university = await this.universityRepository.ofId(
      command.universityId,
    );
    if (!university) {
      throw new RessourceDoesNotExist('University does not exist');
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist('Language not found');
    }

    return this.newsRepository.update(command);
  }
}
