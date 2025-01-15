import { Inject, Injectable } from '@nestjs/common';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  VocabularyPagination,
  VocabularyRepository,
  VOCABULARY_REPOSITORY,
} from 'src/core/ports/vocabulary.repository';

export class FindAllVocabularyListCommand {
  profileId: string;
  languageCode?: string;
  pagination: VocabularyPagination;
}

@Injectable()
export class FindAllVocabularyListUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: FindAllVocabularyListCommand) {
    const language = await this.assetLanguageCodeExist(command.languageCode);

    const vocabularyLists =
      await this.vocabularyRepository.findAllVocabularyLists(
        command.profileId,
        language?.code,
        command.pagination,
      );

    return vocabularyLists;
  }

  private async assetLanguageCodeExist(languageCode?: string) {
    if (!languageCode) {
      return undefined;
    }

    const language = await this.languageRepository.ofCode(languageCode);
    if (!language) {
      throw new Error('Language not found');
    }

    return language;
  }
}
