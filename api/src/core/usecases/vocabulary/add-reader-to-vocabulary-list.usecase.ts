import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Profile } from 'src/core/models';
import { VocabularyList } from 'src/core/models/vocabulary.model';
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
    const profile = await this.assertProfileExist(command.profileId);
    const vocabularyList = await this.assertVocabularyListExist(
      command.vocabularyListId,
    );

    if (!this.assertProfileHasAccessToVocabularyList(vocabularyList, profile)) {
      return;
    }

    return this.vocabularyRepository.addReaderToVocabularyList(
      vocabularyList.id,
      profile.id,
    );
  }

  private async assertVocabularyListExist(id: string) {
    const vocabularyList =
      await this.vocabularyRepository.findVocabularyListById(id);

    if (!vocabularyList) {
      throw new RessourceDoesNotExist('Vocabulary list does not exist');
    }

    return vocabularyList;
  }

  private async assertProfileExist(id: string) {
    const profile = await this.profileRepository.ofId(id);

    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }

    return profile;
  }

  private async assertProfileHasAccessToVocabularyList(
    vocabularyList: VocabularyList,
    profile: Profile,
  ) {
    const isReader = vocabularyList.readers.find(
      (reader) => reader.id === profile.id,
    );
    const isEditor = vocabularyList.editors.find(
      (editor) => editor.id === profile.id,
    );
    const isCreator = vocabularyList.creator.id === profile.id;

    return isReader || isEditor || isCreator;
  }
}
