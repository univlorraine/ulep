import { Inject, Injectable } from '@nestjs/common';
import { Vocabulary } from 'src/core/models/vocabulary.model';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
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
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
  ) {}

  async execute(command: FindAllVocabularyFromListIdCommand) {
    const vocabularies =
      await this.vocabularyRepository.findAllVocabularyfromListId(
        command.vocabularyListId,
        command.search,
        command.pagination,
      );

    await this.enrichVocabulariesWithPronunciationUrls(vocabularies);

    return vocabularies;
  }

  private async enrichVocabulariesWithPronunciationUrls(
    vocabularies: Vocabulary[],
  ): Promise<void> {
    const urlPromises = vocabularies.flatMap((vocabulary) => [
      this.getPronunciationUrl(vocabulary, 'pronunciationWord'),
      this.getPronunciationUrl(vocabulary, 'pronunciationTranslation'),
    ]);

    await Promise.all(urlPromises);
  }

  private async getPronunciationUrl(
    vocabulary: Vocabulary,
    field: string,
  ): Promise<void> {
    if (vocabulary[field]) {
      const url = await this.storage.temporaryUrl(
        vocabulary[field].bucket,
        vocabulary[field].name,
        60 * 60 * 24,
      );
      vocabulary[`${field}Url`] = url;
    }
  }
}
