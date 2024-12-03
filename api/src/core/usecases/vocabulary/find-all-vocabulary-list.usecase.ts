import { Inject, Injectable } from '@nestjs/common';
import {
  VocabularyPagination,
  VocabularyRepository,
  VOCABULARY_REPOSITORY,
} from 'src/core/ports/vocabulary.repository';

export class FindAllVocabularyListCommand {
  profileId: string;
  pagination: VocabularyPagination;
}

@Injectable()
export class FindAllVocabularyListUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
  ) {}

  async execute(command: FindAllVocabularyListCommand) {
    const vocabularyLists =
      await this.vocabularyRepository.findAllVocabularyLists(
        command.profileId,
        command.pagination,
      );

    return vocabularyLists;
  }
}
