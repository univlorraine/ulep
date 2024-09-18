import { ProficiencyLevel, Translation } from 'src/core/models';
import {
  Activity,
  ActivityTheme,
  ActivityThemeCategory,
  ActivityVocabulary,
} from 'src/core/models/activity.model';

export const ACTIVITY_REPOSITORY = 'activity.repository';

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
};

export type CreateActivityThemeCategoryProps = {
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

export interface ActivityRepository {
  allThemes(): Promise<ActivityThemeCategory[]>;
  allThemeCategories(): Promise<ActivityThemeCategory[]>;
  createActivity(props: CreateActivityProps): Promise<Activity>;
  createThemeCategory(
    props: CreateActivityThemeCategoryProps,
  ): Promise<ActivityThemeCategory>;
  createVocabularyForActivity(
    activityId: string,
    vocabulary: string,
  ): Promise<ActivityVocabulary>;
  ofId(id: string): Promise<Activity>;
  ofThemeId(id: string): Promise<ActivityTheme>;
  ofCategoryThemeId(id: string): Promise<ActivityThemeCategory>;
  ofCategoryThemeName(name: string): Promise<ActivityThemeCategory>;
  ofVocabularyId(id: string): Promise<ActivityVocabulary>;
  updateThemeCategory(
    props: UpdateActivityThemeCategoryProps,
  ): Promise<ActivityThemeCategory>;
  deleteCategoryTheme(id: string): Promise<void>;
}
