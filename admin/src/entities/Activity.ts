import { ActivityTheme } from './ActivityTheme';
import Language from './Language';
import MediaObject from './MediaObject';
import ProficiencyLevel from './Proficiency';
import User from './User';

export type Activity = {
    id?: string;
    creator?: {
        user: User;
    };
    title: string;
    description: string;
    image: MediaObject;
    imageUrl: string;
    language: Language;
    level: ProficiencyLevel;
    theme: ActivityTheme;
    exercices: ActivityExercise[];
    vocabulary: ActivityVocabulary[];
};

export type ActivityVocabulary = {
    id?: string;
    content: string;
    file?: File;
};

export type ActivityExercise = {
    id?: string;
    content: string;
    order: number;
};
