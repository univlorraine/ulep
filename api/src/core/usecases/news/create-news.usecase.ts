import { Inject, Injectable } from '@nestjs/common';
import { MediaObject, News, NewsTranslation } from 'src/core/models';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export type CreateNewsCommand = {
  id: string;
  title: string;
  content: string;
  universityId: string;
  image?: MediaObject;
  translations: NewsTranslation[];
  languageCode: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class CreateNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateNewsCommand) {
    return this.newsRepository.create(command);
  }
}
