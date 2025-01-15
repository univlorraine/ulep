import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  VOCABULARY_REPOSITORY,
  VocabularyRepository,
} from 'src/core/ports/vocabulary.repository';

export class DeleteVocabularyListCommand {
  vocabularyListId: string;
}

@Injectable()
export class DeleteVocabularyListUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
  ) {}

  async execute(command: DeleteVocabularyListCommand) {
    await this.assertVocabularyListExist(command.vocabularyListId);

    await this.vocabularyRepository.deleteVocabularyList(
      command.vocabularyListId,
    );
  }

  private async assertVocabularyListExist(id: string) {
    const vocabularyList =
      await this.vocabularyRepository.findVocabularyListById(id);

    if (!vocabularyList) {
      throw new RessourceDoesNotExist('Vocabulary list does not exist');
    }
  }
}
