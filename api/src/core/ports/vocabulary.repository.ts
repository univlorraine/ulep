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
  translation?: string;
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
  wordLanguageId?: string;
  translationLanguageId?: string;
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
    languageCode?: string,
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

  addReaderToVocabularyList(
    vocabularyListId: string,
    profileId: string,
  ): Promise<void>;

  removeReaderFromVocabularyList(
    vocabularyListId: string,
    profileId: string,
  ): Promise<void>;

  countVocabulariesByProfileAndLanguage(
    profileId: string,
    language: string,
  ): Promise<number>;
}
