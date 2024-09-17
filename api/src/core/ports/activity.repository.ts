import { ProficiencyLevel } from 'src/core/models';
import {
  Activity,
  ActivityTheme,
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

export interface ActivityRepository {
  createActivity(props: CreateActivityProps): Promise<Activity>;
  createVocabularyForActivity(
    activityId: string,
    vocabulary: string,
  ): Promise<ActivityVocabulary>;
  ofId(id: string): Promise<Activity>;
  ofThemeId(id: string): Promise<ActivityTheme>;
}
