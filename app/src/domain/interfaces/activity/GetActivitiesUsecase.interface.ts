import { Activity, ActivityTheme } from '../../entities/Activity';
import Language from '../../entities/Language';

export const DEFAULT_ACTIVITIES_PAGE_SIZE = 10;

export type GetActivitiesFilters = {
    language: Language[];
    proficiency: CEFR[];
    activityTheme: ActivityTheme[];
    shouldTakeAllMine: boolean;
    page: number;
    searchTitle?: string;
};

interface GetActivitiesUsecaseInterface {
    execute: (filters: GetActivitiesFilters) => Promise<Activity[] | Error>;
}

export default GetActivitiesUsecaseInterface;
