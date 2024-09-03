import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  VOCABULARY_REPOSITORY,
  VocabularyRepository,
} from 'src/core/ports/vocabulary.repository';

export class CreateVocabularyListCommand {
  name: string;
  symbol: string;
  profileId: string;
  translationLanguageCode: string;
  wordLanguageCode: string;
}

@Injectable()
export class CreateVocabularyListUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
  ) {}

  async execute(command: CreateVocabularyListCommand) {
    const translationLanguage = await this.assertLanguageExist(
      command.translationLanguageCode,
    );
    const wordLanguage = await this.assertLanguageExist(
      command.wordLanguageCode,
    );
    await this.assertProfileExist(command.profileId);

    const vocabularyList = await this.vocabularyRepository.createVocabularyList(
      {
        name: command.name,
        symbol: command.symbol,
        profileId: command.profileId,
        translationLanguageId: translationLanguage.id,
        wordLanguageId: wordLanguage.id,
      },
    );

    return vocabularyList;
  }

  private async assertLanguageExist(id: string) {
    const language = await this.languageRepository.ofCode(id);

    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }

  private async assertProfileExist(id: string) {
    const profile = await this.profileRepository.ofId(id);

    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }
}
