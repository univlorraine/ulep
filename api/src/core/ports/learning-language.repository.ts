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

import { Collection, SortOrder } from '@app/common';
import { LearningLanguage, LearningLanguageWithTandem } from '../models';
import { HistorizedUnmatchedLearningLanguage } from 'src/core/models/historized-unmatched-learning-language';

export const LEARNING_LANGUAGE_REPOSITORY = 'learning-language.repository';

export enum LearningLanguageQuerySortKey {
  PROFILE = 'profile',
  UNIVERSITY = 'university',
  LANGUAGE = 'language',
  LEVEL = 'level',
  CREATED_AT = 'createdAt',
  SPECIFIC_PROGRAM = 'specificProgram',
  ROLE = 'role',
}

export interface LearningLanguageRepositoryGetProps {
  page?: number;
  limit?: number;
  universityIds: string[];
  hasActiveTandem?: boolean;
  hasActionableTandem?: boolean;
  hasPausedTandem?: boolean;
  lastname?: string;
  orderBy?: {
    field: LearningLanguageQuerySortKey;
    order: SortOrder;
  };
}

export interface LearningLanguageRepository {
  ofId: (id: string) => Promise<LearningLanguage | null>;

  ofProfile: (id: string) => Promise<LearningLanguage[]>;

  create: (learningLanguage: LearningLanguage) => Promise<void>;

  getAvailableLearningLanguagesSpeakingLanguageFromUniversities: (
    languageId: string,
    universityIds: string[],
  ) => Promise<LearningLanguage[]>;

  getAvailableLearningLanguagesOfUniversities: (
    universityIds: string[],
  ) => Promise<LearningLanguage[]>;

  getAvailableLearningLanguagesSpeakingOneOfLanguagesAndFromUniversities: (
    allowedLanguages: string[],
    universityIds: string[],
  ) => Promise<LearningLanguage[]>;

  getUnmatchedLearningLanguages: () => Promise<LearningLanguage[]>;

  hasAnActiveTandem: (id: string) => Promise<boolean>;

  OfUniversities: (
    props: LearningLanguageRepositoryGetProps,
  ) => Promise<Collection<LearningLanguageWithTandem>>;

  delete(id: string): Promise<void>;

  update(learningLanguage: LearningLanguage): Promise<void>;

  archiveUnmatchedLearningLanguages(
    learningLanguages: LearningLanguage[],
    purgeId: string,
  ): Promise<void>;

  getHistoricUnmatchedLearningLanguageByUserIdAndLanguageId(
    userId: string,
    languageId: string,
  ): Promise<HistorizedUnmatchedLearningLanguage>;
}
