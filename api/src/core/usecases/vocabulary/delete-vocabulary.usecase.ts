import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  VOCABULARY_REPOSITORY,
  VocabularyRepository,
} from 'src/core/ports/vocabulary.repository';

export class DeleteVocabularyCommand {
  vocabularyId: string;
}

@Injectable()
export class DeleteVocabularyUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
  ) {}

  async execute(command: DeleteVocabularyCommand) {
    await this.assertVocabularyExist(command.vocabularyId);

    await this.vocabularyRepository.deleteVocabulary(command.vocabularyId);
  }

  private async assertVocabularyExist(id: string) {
    const vocabulary = await this.vocabularyRepository.findVocabularyById(id);

    if (!vocabulary) {
      throw new RessourceDoesNotExist('Vocabulary does not exist');
    }
  }
}
