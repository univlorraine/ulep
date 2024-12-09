import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  VocabularyRepository,
  VOCABULARY_REPOSITORY,
} from 'src/core/ports/vocabulary.repository';

export class CreateVocabularyCommand {
  translation?: string;
  vocabularyListId: string;
  word: string;
}

@Injectable()
export class CreateVocabularyUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
  ) {}

  async execute(command: CreateVocabularyCommand) {
    await this.assertVocabularyListExist(command.vocabularyListId);

    const vocabulary = await this.vocabularyRepository.createVocabulary({
      translation: command.translation,
      vocabularyListId: command.vocabularyListId,
      word: command.word,
    });

    return vocabulary;
  }

  private async assertVocabularyListExist(id: string) {
    const vocabularyList =
      await this.vocabularyRepository.findVocabularyListById(id);

    if (!vocabularyList) {
      throw new RessourceDoesNotExist('Vocabulary list does not exist');
    }
  }
}
