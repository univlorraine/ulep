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
    creditImage?: string;
    imageUrl: string;
    language: Language;
    languageLevel: ProficiencyLevel;
    theme: ActivityTheme;
    ressourceUrl?: string;
    ressourceFileUrl?: string;
    exercises: ActivityExercise[];
    vocabularies: ActivityVocabulary[];
};

export type ActivityVocabulary = {
    id?: string;
    content: string;
    file?: File;
    pronunciationActivityVocabularyUrl?: string;
};

export type ActivityExercise = {
    id?: string;
    content: string;
    order: number;
};

export enum ActivityStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    IN_VALIDATION = 'IN_VALIDATION',
    REJECTED = 'REJECTED',
}
