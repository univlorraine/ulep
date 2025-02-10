import { Injectable } from '@nestjs/common';
import { Profile } from 'src/core/models';
import { Vocabulary, VocabularyList } from 'src/core/models/vocabulary.model';
import {
  CreateVocabularyListProps,
  CreateVocabularyProps,
  UpdateVocabularyListProps,
  UpdateVocabularyProps,
  VocabularyPagination,
  VocabularyQueryWhere,
  VocabularyRepository,
} from 'src/core/ports/vocabulary.repository';

@Injectable()
export class InMemoryVocabularyRepository implements VocabularyRepository {
  #vocabularies: Vocabulary[] = [];
  #vocabularyLists: VocabularyList[] = [];
  #vocabularyRelations: Map<string, Vocabulary[]> = new Map();

  init(vocabularies: Vocabulary[], vocabularyLists: VocabularyList[]): void {
    this.#vocabularies = vocabularies;
    this.#vocabularyLists = vocabularyLists;
  }

  reset(): void {
    this.#vocabularies = [];
    this.#vocabularyLists = [];
    this.#vocabularyRelations = new Map();
  }

  async createVocabulary(props: CreateVocabularyProps): Promise<Vocabulary> {
    const vocabulary = new Vocabulary({
      ...props,
      id: Date.now().toString(),
    });
    this.#vocabularies.push(vocabulary);
    this.#vocabularyRelations.set(props.vocabularyListId, [
      ...(this.#vocabularyRelations.get(props.vocabularyListId) || []),
      vocabulary,
    ]);
    return vocabulary;
  }

  async createVocabularyList(
    props: CreateVocabularyListProps,
  ): Promise<VocabularyList> {
    const vocabularyList = new VocabularyList({
      ...props,
      editors: [],
      readers: [],
      vocabularies: [],
      translationLanguage: null,
      wordLanguage: null,
      id: Date.now().toString(),
      creator: {} as Profile,
    });
    this.#vocabularyLists.push(vocabularyList);
    return vocabularyList;
  }

  async findAllVocabularyLists(
    profileId: string,
    languageCode?: string,
    pagination?: VocabularyPagination,
  ): Promise<VocabularyList[]> {
    const start = pagination?.page
      ? (pagination.page - 1) * pagination.limit
      : 0;
    const end = pagination?.limit ? start + pagination.limit : undefined;
    return this.#vocabularyLists.slice(start, end);
  }

  async findAllVocabularyfromListId(
    vocabularyListId: string,
    where?: VocabularyQueryWhere,
    pagination?: VocabularyPagination,
  ): Promise<Vocabulary[]> {
    let filteredVocabularies = this.#vocabularyRelations.get(vocabularyListId);

    if (where?.search) {
      filteredVocabularies = filteredVocabularies.filter(
        (v) =>
          v.word.includes(where.search) || v.translation.includes(where.search),
      );
    }

    const start = pagination?.page
      ? (pagination.page - 1) * pagination.limit
      : 0;
    const end = pagination?.limit ? start + pagination.limit : undefined;
    return filteredVocabularies.slice(start, end);
  }

  async findAllVocabularyFromSelectedListsId(
    vocabularySelectedListsId: string[],
    pagination?: VocabularyPagination,
  ): Promise<Vocabulary[]> {
    let filteredVocabularies: Vocabulary[] = [];

    vocabularySelectedListsId.forEach((id) => {
      const vocabularies = this.#vocabularyRelations.get(id) || [];
      filteredVocabularies = filteredVocabularies.concat(vocabularies);
    });

    const start = pagination?.page
      ? (pagination.page - 1) * pagination.limit
      : 0;
    const end = pagination?.limit ? start + pagination.limit : undefined;
    return filteredVocabularies.slice(start, end);
  }

  async findVocabularyListById(id: string): Promise<VocabularyList> {
    return this.#vocabularyLists.find((vl) => vl.id === id);
  }

  async findVocabularyById(id: string): Promise<Vocabulary> {
    return this.#vocabularies.find((v) => v.id === id);
  }

  addReaderToVocabularyList(
    vocabularyListId: string,
    profileId: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  removeReaderFromVocabularyList(
    vocabularyListId: string,
    profileId: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async updateVocabulary(props: UpdateVocabularyProps): Promise<Vocabulary> {
    const index = this.#vocabularies.findIndex((v) => v.id === props.id);
    if (index !== -1) {
      this.#vocabularies[index] = { ...this.#vocabularies[index], ...props };
      return this.#vocabularies[index];
    }
    return null;
  }

  async updateVocabularyList(
    props: UpdateVocabularyListProps,
  ): Promise<VocabularyList> {
    const index = this.#vocabularyLists.findIndex((vl) => vl.id === props.id);
    if (index !== -1) {
      this.#vocabularyLists[index] = {
        ...this.#vocabularyLists[index],
        ...props,
      };
      return this.#vocabularyLists[index];
    }
    return null;
  }

  async deleteVocabulary(id: string): Promise<void> {
    const index = this.#vocabularies.findIndex((v) => v.id === id);
    if (index !== -1) {
      this.#vocabularies.splice(index, 1);
    }
  }

  async deleteVocabularyList(id: string): Promise<void> {
    const index = this.#vocabularyLists.findIndex((vl) => vl.id === id);
    if (index !== -1) {
      this.#vocabularyLists.splice(index, 1);
    }
  }

  async countVocabulariesByProfileAndLanguage(
    profileId: string,
    language: string,
  ): Promise<number> {
    return 0;
  }
}
