import { Inject, Injectable } from '@nestjs/common';
import { Vocabulary } from 'src/core/models/vocabulary.model';
import {
  STORAGE_INTERFACE,
  StorageInterface,
} from 'src/core/ports/storage.interface';
import {
  VOCABULARY_REPOSITORY,
  VocabularyPagination,
  VocabularyRepository,
} from 'src/core/ports/vocabulary.repository';

export class FindAllVocabularyFromSelectedListsIdCommand {
  vocabularySelectedListsId: string[];
  pagination: VocabularyPagination;
}

@Injectable()
export class FindAllVocabularyFromSelectedListsIdUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
  ) {}

  async execute(command: FindAllVocabularyFromSelectedListsIdCommand) {
    const vocabularies =
      await this.vocabularyRepository.findAllVocabularyFromSelectedListsId(
        command.vocabularySelectedListsId,
        command.pagination,
      );

    await this.enrichVocabulariesWithPronunciationUrls(vocabularies);
    await this.shuffleVocabularies(vocabularies);

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

  private async shuffleVocabularies(
    vocabularies: Vocabulary[],
  ): Promise<Vocabulary[]> {
    for (let i = vocabularies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [vocabularies[i], vocabularies[j]] = [vocabularies[j], vocabularies[i]];
    }
    return vocabularies;
  }
}
