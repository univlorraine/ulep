import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Language } from 'src/core/models';
import { LogEntryType } from 'src/core/models/log-entry.model';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  VocabularyRepository,
  VOCABULARY_REPOSITORY,
} from 'src/core/ports/vocabulary.repository';
import { CreateOrUpdateLogEntryUsecase } from 'src/core/usecases/log-entry';

export class UpdateVocabularyListCommand {
  vocabularyListId: string;
  name?: string;
  symbol?: string;
  profileIds?: string[];
  wordLanguageCode?: string;
  translationLanguageCode?: string;
  userId?: string;
}

@Injectable()
export class UpdateVocabularyListUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(CreateOrUpdateLogEntryUsecase)
    private readonly createOrUpdateLogEntryUsecase: CreateOrUpdateLogEntryUsecase,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: UpdateVocabularyListCommand) {
    const oldVocabularyList = await this.assertVocabularyListExist(
      command.vocabularyListId,
    );
    let wordLanguage: Language | undefined;
    let translationLanguage: Language | undefined;
    if (command.wordLanguageCode) {
      wordLanguage = await this.assertLanguageExist(command.wordLanguageCode);
    }
    if (command.translationLanguageCode) {
      translationLanguage = await this.assertLanguageExist(
        command.translationLanguageCode,
      );
    }
    await Promise.all(
      command.profileIds.map((profileId) => this.assertProfileExist(profileId)),
    );

    const vocabularyList = await this.vocabularyRepository.updateVocabularyList(
      {
        id: command.vocabularyListId,
        name: command.name ?? oldVocabularyList.name,
        symbol: command.symbol ?? oldVocabularyList.symbol,
        profileIds: command.profileIds,
        wordLanguageId: wordLanguage?.id ?? oldVocabularyList.wordLanguage.id,
        translationLanguageId:
          translationLanguage?.id ?? oldVocabularyList.translationLanguage.id,
      },
    );

    if (command.profileIds && command.profileIds.length > 0) {
      const learningLanguage =
        vocabularyList.creator.findLearningLanguageByCode(
          vocabularyList.translationLanguage.code,
        );
      if (learningLanguage) {
        await this.createOrUpdateLogEntryUsecase.execute({
          learningLanguageId: learningLanguage.id,
          type: LogEntryType.SHARE_VOCABULARY,
          metadata: {
            vocabularyListId: command.vocabularyListId,
            vocabularyListName: vocabularyList.name,
          },
        });
      }
    }

    return vocabularyList;
  }

  private async assertVocabularyListExist(id: string) {
    const vocabularyList =
      await this.vocabularyRepository.findVocabularyListById(id);

    if (!vocabularyList) {
      throw new RessourceDoesNotExist('Vocabulary list does not exist');
    }

    return vocabularyList;
  }

  private async assertProfileExist(profileId: string) {
    const profile = await this.profileRepository.ofId(profileId);

    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }

  private async assertLanguageExist(languageId: string) {
    const language = await this.languageRepository.ofCode(languageId);

    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }
}
