import { Activity } from '../../entities/Activity';

export type CreateActivityCommand = {
    title: string;
    description: string;
    languageLevel: CEFR;
    languageCode: string;
    themeId: string;
    image: File;
    ressource?: File;
    ressourceUrl?: string;
    creditImage?: string;
    profileId: string;
    exercises: { content: string; order: number }[];
    vocabularies: { content: string; file?: File }[];
};

interface CreateActivityUsecaseInterface {
    execute: (command: CreateActivityCommand) => Promise<Activity | Error>;
}

export default CreateActivityUsecaseInterface;
