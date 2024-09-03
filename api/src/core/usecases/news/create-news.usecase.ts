import { Inject, Injectable } from '@nestjs/common';
import {
  NewsTranslation,
  TextContent,
  Translation,
  University,
} from 'src/core/models';
import {
  NEWS_REPOSITORY,
  NewsRepository,
} from 'src/core/ports/news.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export class CreateNewsCommand {
  title: string;
  content: string;
  languageCode: string;
  universityId: string;
  translations?: NewsTranslation[];
}

@Injectable()
export class CreateNewsUsecase {
  constructor(
    @Inject(NEWS_REPOSITORY)
    private readonly newsRepository: NewsRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateNewsCommand) {
    const titleTranslations: Translation[] = command.translations?.map(
      (translation) => ({
        language: translation.languageCode,
        content: translation.title,
      }),
    );

    const contentTranslations: Translation[] = command.translations?.map(
      (translation) => ({
        language: translation.languageCode,
        content: translation.content,
      }),
    );

    return this.newsRepository.create({
      id: this.uuidProvider.generate(),
      title: {
        id: this.uuidProvider.generate(),
        content: command.title,
        language: command.languageCode,
        translations: titleTranslations,
      },
      content: {
        id: this.uuidProvider.generate(),
        content: command.content,
        language: command.languageCode,
        translations: contentTranslations,
      },
      universityId: command.universityId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
