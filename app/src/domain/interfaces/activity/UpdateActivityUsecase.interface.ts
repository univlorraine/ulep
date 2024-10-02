import { Activity, ActivityStatus } from '../../entities/Activity';

export type UpdateActivityCommand = {
    title?: string;
    description?: string;
    languageLevel?: CEFR;
    languageCode?: string;
    themeId?: string;
    image?: File;
    ressource?: File;
    ressourceUrl?: string;
    creditImage?: string;
    profileId?: string;
    exercises?: { content: string; order: number }[];
    vocabularies?: { content: string; file?: File }[];
    vocabulariesIdsToDelete?: string[];
    status?: ActivityStatus;
};

interface UpdateActivityUsecaseInterface {
    execute: (id: string, command: UpdateActivityCommand) => Promise<Activity | Error>;
}

export default UpdateActivityUsecaseInterface;
