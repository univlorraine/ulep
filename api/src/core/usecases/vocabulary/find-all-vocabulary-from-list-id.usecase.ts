import { Inject, Injectable } from '@nestjs/common';
import {
  VOCABULARY_REPOSITORY,
  VocabularyPagination,
  VocabularyQueryWhere,
  VocabularyRepository,
} from 'src/core/ports/vocabulary.repository';

export class FindAllVocabularyFromListIdCommand {
  vocabularyListId: string;
  pagination: VocabularyPagination;
  search?: VocabularyQueryWhere;
}

@Injectable()
export class FindAllVocabularyFromListIdUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
  ) {}

  async execute(command: FindAllVocabularyFromListIdCommand) {
    const vocabularies =
      await this.vocabularyRepository.findAllVocabularyfromListId(
        command.vocabularyListId,
        command.search,
        command.pagination,
      );

    return vocabularies;
  }
}
