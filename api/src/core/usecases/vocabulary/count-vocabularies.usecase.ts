import { Inject, Injectable } from '@nestjs/common';
import {
  VocabularyRepository,
  VOCABULARY_REPOSITORY,
} from 'src/core/ports/vocabulary.repository';

export class CountVocabulariesCommand {
  profileId: string;
  language: string;
}

@Injectable()
export class CountVocabulariesUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
  ) {}

  async execute(command: CountVocabulariesCommand) {
    const countVocabularies =
      await this.vocabularyRepository.countVocabulariesByProfileAndLanguage(
        command.profileId,
        command.language,
      );

    return countVocabularies ?? 0;
  }
}
