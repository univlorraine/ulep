/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
