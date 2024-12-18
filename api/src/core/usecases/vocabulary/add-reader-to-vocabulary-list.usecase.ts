import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  VocabularyRepository,
  VOCABULARY_REPOSITORY,
} from 'src/core/ports/vocabulary.repository';

export class AddReaderToVocabularyListCommand {
  vocabularyListId: string;
  profileId: string;
}

@Injectable()
export class AddReaderToVocabularyListUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: AddReaderToVocabularyListCommand) {
    await this.assertProfileExist(command.profileId);
    await this.assertVocabularyListExist(command.vocabularyListId);

    await this.vocabularyRepository.addReaderToVocabularyList(
      command.vocabularyListId,
      command.profileId,
    );
  }

  private async assertVocabularyListExist(id: string) {
    const vocabularyList =
      await this.vocabularyRepository.findVocabularyListById(id);

    if (!vocabularyList) {
      throw new RessourceDoesNotExist('Vocabulary list does not exist');
    }
  }

  private async assertProfileExist(id: string) {
    const profile = await this.profileRepository.ofId(id);

    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }
}
