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
  status?: ActivityStatus[];
  profileId?: string;
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
}
