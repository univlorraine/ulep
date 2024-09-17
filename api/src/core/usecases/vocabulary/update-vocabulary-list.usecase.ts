import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  VOCABULARY_REPOSITORY,
  VocabularyRepository,
} from 'src/core/ports/vocabulary.repository';

export class UpdateVocabularyListCommand {
  vocabularyListId: string;
  name?: string;
  symbol?: string;
  profileIds?: string[];
}

@Injectable()
export class UpdateVocabularyListUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
  ) {}

  async execute(command: UpdateVocabularyListCommand) {
    const oldVocabularyList = await this.assertVocabularyListExist(
      command.vocabularyListId,
    );

    await Promise.all(
      command.profileIds.map((profileId) => this.assertProfileExist(profileId)),
    );

    const vocabularyList = await this.vocabularyRepository.updateVocabularyList(
      {
        id: command.vocabularyListId,
        name: command.name ?? oldVocabularyList.name,
        symbol: command.symbol ?? oldVocabularyList.symbol,
        profileIds: command.profileIds,
      },
    );

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
}
