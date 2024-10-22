import { Vocabulary, VocabularyList } from 'src/core/models/vocabulary.model';

export const VOCABULARY_REPOSITORY = 'vocabulary.repository';

export type VocabularyPagination = {
  limit?: number;
  page?: number;
};

export type CreateVocabularyListProps = {
  name: string;
  symbol: string;
  translationLanguageId: string;
  wordLanguageId: string;
  profileId: string;
};

export type CreateVocabularyProps = {
  translation: string;
  vocabularyListId: string;
  word: string;
};

export type UpdateVocabularyProps = {
  id: string;
  translation: string;
  word: string;
};

export type UpdateVocabularyListProps = {
  id: string;
  name?: string;
  symbol?: string;
  profileIds?: string[];
};

export type VocabularyQueryWhere = {
  search?: string;
};

export interface VocabularyRepository {
  createVocabulary(props: CreateVocabularyProps): Promise<Vocabulary>;

  createVocabularyList(
    props: CreateVocabularyListProps,
  ): Promise<VocabularyList>;

  findAllVocabularyLists(
    profileId: string,
    pagination?: VocabularyPagination,
  ): Promise<VocabularyList[]>;

  findAllVocabularyfromListId(
    vocabularyListId: string,
    where?: VocabularyQueryWhere,
    pagination?: VocabularyPagination,
  ): Promise<Vocabulary[]>;

  findAllVocabularyFromSelectedListsId(
    vocabularySelectedListsId: string[],
    pagination?: VocabularyPagination,
  ): Promise<Vocabulary[]>;

  findVocabularyListById(id: string): Promise<VocabularyList | null>;

  findVocabularyById(id: string): Promise<Vocabulary | null>;

  updateVocabulary(props: UpdateVocabularyProps): Promise<Vocabulary>;

  updateVocabularyList(
    props: UpdateVocabularyListProps,
  ): Promise<VocabularyList>;

  deleteVocabulary(id: string): Promise<void>;

  deleteVocabularyList(id: string): Promise<void>;
}
