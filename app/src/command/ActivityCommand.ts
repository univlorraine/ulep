import {
    Activity,
    ActivityExercises,
    ActivityStatus,
    ActivityTheme,
    ActivityThemeCategory,
    ActivityVocabulary,
} from '../domain/entities/Activity';
import LanguageCommand from './LanguageCommand';
import ProfileCommand, { profileCommandToDomain } from './ProfileCommand';

export interface ActivityThemeCommand {
    id: string;
    content: string;
}

export interface ActivityThemeCategoryCommand {
    id: string;
    content: string;
    themes: ActivityThemeCommand[];
}

export interface ActivityVocabularyCommand {
    id: string;
    content: string;
    pronunciationActivityVocabularyUrl: string;
}

export interface ActivityExercisesCommand {
    id: string;
    content: string;
    order: number;
}

export interface ActivityCommand {
    id: string;
    title: string;
    description: string;
    creator: ProfileCommand;
    status: ActivityStatus;
    language: LanguageCommand;
    languageLevel: CEFR;
    imageUrl: string;
    ressourceUrl?: string;
    ressourceFileUrl?: string;
    theme: ActivityThemeCommand;
    vocabularies: ActivityVocabularyCommand[];
    exercises: ActivityExercisesCommand[];
}

export const activityThemeCommandToDomain = (command: ActivityThemeCommand) => {
    return new ActivityTheme(command.id, command.content);
};

export const activityThemeCategoryCommandToDomain = (command: ActivityThemeCategoryCommand) => {
    return new ActivityThemeCategory(command.id, command.content, command.themes.map(activityThemeCommandToDomain));
};

export const activityVocabularyCommandToDomain = (command: ActivityVocabularyCommand) => {
    return new ActivityVocabulary(command.id, command.content, command.pronunciationActivityVocabularyUrl);
};

export const activityExercisesCommandToDomain = (command: ActivityExercisesCommand) => {
    return new ActivityExercises(command.id, command.content, command.order);
};

export const activityCommandToDomain = (command: ActivityCommand) => {
    return new Activity({
        id: command.id,
        title: command.title,
        description: command.description,
        creator: profileCommandToDomain(command.creator),
        status: command.status,
        language: command.language,
        languageLevel: command.languageLevel,
        imageUrl: command.imageUrl,
        ressourceUrl: command.ressourceUrl,
        ressourceFileUrl: command.ressourceFileUrl,
        activityTheme: activityThemeCommandToDomain(command.theme),
        vocabularies: command.vocabularies.map(activityVocabularyCommandToDomain),
        exercises: command.exercises.map(activityExercisesCommandToDomain),
    });
};
