/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
import UniversityCommand, { universityCommandToDomain } from './UniversityCommand';

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
    creditImage?: string;
    ressourceUrl?: string;
    ressourceFileUrl?: string;
    theme: ActivityThemeCommand;
    vocabularies?: ActivityVocabularyCommand[];
    exercises: ActivityExercisesCommand[];
    ressourceOgUrl?: any;
    university: UniversityCommand;
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
        creator: command.creator ? profileCommandToDomain(command.creator) : undefined,
        status: command.status,
        language: command.language,
        languageLevel: command.languageLevel,
        imageUrl: command.imageUrl,
        creditImage: command.creditImage,
        ressourceUrl: command.ressourceUrl ? command.ressourceUrl : undefined,
        ressourceOgUrl: command.ressourceOgUrl,
        ressourceFileUrl: command.ressourceFileUrl,
        activityTheme: activityThemeCommandToDomain(command.theme),
        vocabularies: command.vocabularies ? command.vocabularies.map(activityVocabularyCommandToDomain) : [],
        exercises: command.exercises.map(activityExercisesCommandToDomain),
        university: universityCommandToDomain(command.university),
    });
};
