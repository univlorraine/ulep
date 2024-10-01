import { Activity, ActivityTheme } from '../../entities/Activity';
import Language from '../../entities/Language';

export type GetActivitiesFilters = {
    language: Language[];
    proficiency: CEFR[];
    activityTheme: ActivityTheme[];
    isMe: boolean;
    page: number;
    searchTitle?: string;
};

interface GetActivitiesUsecaseInterface {
    execute: (filters: GetActivitiesFilters) => Promise<Activity[] | Error>;
}

export default GetActivitiesUsecaseInterface;
