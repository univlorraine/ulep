import { Activity } from '../../entities/Activity';

export type CreateActivityCommand = {
    title: string;
    description: string;
    languageLevel: CEFR;
    languageCode: string;
    themeId: string;
    image: File;
    ressourceFile: File;
    ressourceUrl?: string;
    creditImage?: string;
    profileId: string;
    exercises: { content: string; order: number }[];
    vocabularies: { content: string; pronunciationActivityVocabulary?: File }[];
};

interface CreateActivityUsecaseInterface {
    execute: (command: CreateActivityCommand) => Promise<Activity | Error>;
}

export default CreateActivityUsecaseInterface;
