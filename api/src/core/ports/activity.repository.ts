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
  status: ActivityStatus[];
  profileId?: string;
  pagination: ActivityPagination;
};

export type CreateActivityProps = {
  title: string;
  description: string;
  profileId: string;
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

export interface ActivityRepository {
  all(
    props: GetActivitiesProps,
  ): Promise<{ items: Activity[]; totalItems: number }>;
  allThemes(): Promise<ActivityThemeCategory[]>;
  allThemeCategories(): Promise<ActivityThemeCategory[]>;
  createActivity(props: CreateActivityProps): Promise<Activity>;
  createTheme(props: CreateActivityThemeProps): Promise<ActivityTheme>;
  createThemeCategory(
    props: CreateActivityThemeCategoryProps,
  ): Promise<ActivityThemeCategory>;
  createVocabularyForActivity(
    activityId: string,
    vocabulary: string,
  ): Promise<ActivityVocabulary>;
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
  updateTheme(props: UpdateActivityThemeProps): Promise<ActivityTheme>;
  deleteCategoryTheme(id: string): Promise<void>;
  deleteTheme(id: string): Promise<void>;
}
