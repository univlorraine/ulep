import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  VOCABULARY_REPOSITORY,
  VocabularyRepository,
} from 'src/core/ports/vocabulary.repository';

export class UpdateVocabularyCommand {
  vocabularyId: string;
  translation?: string;
  word?: string;
}

@Injectable()
export class UpdateVocabularyUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
  ) {}

  async execute(command: UpdateVocabularyCommand) {
    const oldVocabulary = await this.assertVocabularyExist(
      command.vocabularyId,
    );

    const vocabulary = await this.vocabularyRepository.updateVocabulary({
      id: command.vocabularyId,
      translation: command.translation ?? oldVocabulary.translation,
      word: command.word ?? oldVocabulary.word,
    });

    return vocabulary;
  }

  private async assertVocabularyExist(id: string) {
    const vocabulary = await this.vocabularyRepository.findVocabularyById(id);

    if (!vocabulary) {
      throw new RessourceDoesNotExist('Vocabulary does not exist');
    }

    return vocabulary;
  }
}
