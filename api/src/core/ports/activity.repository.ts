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

import { ProficiencyLevel, Translation } from 'src/core/models';
import {
  Activity,
  ActivityStatus,
  ActivityTheme,
  ActivityThemeCategory,
  ActivityVocabulary,
} from 'src/core/models/activity.model';

export const ACTIVITY_REPOSITORY = 'activity.repository';

export type ActivityPagination = {
  limit?: number;
  page?: number;
};

export type GetActivitiesProps = {
  languagesCodes?: string[];
  languageLevels?: string[];
  themesIds?: string[];
  searchTitle?: string;
  profileId?: string;
  shouldOnlyTakeMine?: boolean;
  pagination?: ActivityPagination;
};

export type GetAllActivityThemesProps = {
  pagination?: ActivityPagination;
};

export type GetActivitiesForAdminProps = {
  languageCode?: string;
  languageLevel?: string;
  searchTitle?: string;
  status?: ActivityStatus[];
  category?: string;
  theme?: string;
  university?: string;
  pagination: ActivityPagination;
  currentUserUniversityId?: string;
};

export type CreateActivityProps = {
  title: string;
  description: string;
  profileId?: string;
  universityId: string;
  themeId: string;
  exercises: { content: string; order: number }[];
  languageLevel: ProficiencyLevel;
  languageCode: string;
  ressourceUrl?: string;
  creditImage?: string;
  metadata?: any;
};

export type CreateActivityThemeCategoryProps = {
  content: string;
  languageCode: string;
  translations: Translation[];
};

export type CreateActivityThemeProps = {
  categoryId: string;
  content: string;
  languageCode: string;
  translations: Translation[];
};

export type UpdateActivityThemeCategoryProps = {
  id: string;
  textContentId: string;
  content: string;
  languageCode: string;
  translations: Translation[];
};

export type UpdateActivityThemeProps = {
  id: string;
  textContentId: string;
  content: string;
  languageCode: string;
  translations: Translation[];
};

export type UpdateActivityProps = {
  id: string;
  title: string;
  description: string;
  themeId: string;
  exercises: { content: string; order: number }[];
  languageLevel: ProficiencyLevel;
  languageCode: string;
  ressourceUrl?: string;
  creditImage?: string;
  metadata?: any;
};

export type UpdateActivityVocabularyProps = {
  id: string;
  content: string;
  pronunciation?: Express.Multer.File;
  pronunciationUrl?: string;
};

export interface ActivityRepository {
  all(
    props: GetActivitiesProps,
  ): Promise<{ items: Activity[]; totalItems: number }>;
  allWithThemeWithCategory(
    props: GetActivitiesForAdminProps,
  ): Promise<{ items: Activity[]; totalItems: number }>;
  allThemes(
    props: GetAllActivityThemesProps,
  ): Promise<{ items: ActivityThemeCategory[]; totalItems: number }>;
  createActivity(props: CreateActivityProps): Promise<Activity>;
  createTheme(props: CreateActivityThemeProps): Promise<ActivityTheme>;
  createThemeCategory(
    props: CreateActivityThemeCategoryProps,
  ): Promise<ActivityThemeCategory>;
  createVocabularyForActivity(
    activityId: string,
    vocabulary: string,
  ): Promise<ActivityVocabulary>;
  updateVocabulary(id: string, content: string): Promise<ActivityVocabulary>;
  ofId(id: string): Promise<Activity>;
  ofThemeId(id: string): Promise<ActivityTheme>;
  ofThemeNameAndCategoryId(
    categoryId: string,
    name: string,
  ): Promise<ActivityTheme>;
  ofCategoryThemeId(id: string): Promise<ActivityThemeCategory>;
  ofCategoryThemeName(name: string): Promise<ActivityThemeCategory>;
  ofVocabularyId(id: string): Promise<ActivityVocabulary>;
  updateThemeCategory(
    props: UpdateActivityThemeCategoryProps,
  ): Promise<ActivityThemeCategory>;
  deleteActivity(id: string): Promise<void>;
  deleteExercise(exerciseId: string): Promise<void>;
  deleteVocabulary(vocabularyId: string): Promise<void>;
  updateActivity(props: UpdateActivityProps): Promise<Activity>;
  updateActivityStatus(id: string, status: ActivityStatus): Promise<Activity>;
  updateTheme(props: UpdateActivityThemeProps): Promise<ActivityTheme>;
  deleteCategoryTheme(id: string): Promise<void>;
  deleteTheme(id: string): Promise<void>;
  countActivitiesByProfileAndStatus(
    profileId: string,
    status: ActivityStatus,
  ): Promise<number>;
}
