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

import { Interest } from '../domain/entities/CategoryInterests';
import Language from '../domain/entities/Language';
import Profile from '../domain/entities/Profile';
import TestedLanguage from '../domain/entities/TestedLanguage';
import { goalCommandToDomain } from './GoalCommand';
import learningLanguageResultToDomain, { LearningLanguageResult } from './LearningLanguageResult';
import UserResult, { userResultToDomain } from './UserResult';

interface ProfileCommand {
    id: string;
    interests: { id: string; name: string }[];
    nativeLanguage: {
        code: string;
        name: string;
    };
    masteredLanguages: {
        code: string;
        name: string;
    }[];
    testedLanguages: {
        code: string;
        name: string;
        level: CEFR;
    }[];
    learningLanguages: LearningLanguageResult[];
    objectives: {
        id: string;
        name: string;
        image: { id: string; mimeType: string };
    }[];
    meetingFrequency: string;
    availabilities: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    availabilitiesNote?: string;
    availabilitiesNotePrivacy?: boolean;
    biography: {
        anecdote: string;
        experience: string;
        favoritePlace: string;
        superpower: string;
    };
    user: UserResult;
}

export const profileCommandToDomain = (command: ProfileCommand): Profile => {
    return new Profile(
        command.id,
        new Language(command.nativeLanguage.code, command.nativeLanguage.code, command.nativeLanguage.name),
        command.masteredLanguages.map(
            (masteredLanguage) => new Language(masteredLanguage.code, masteredLanguage.code, masteredLanguage.name)
        ),
        command.testedLanguages.map(
            (testedLanguage) => new TestedLanguage(testedLanguage.code, testedLanguage.name, testedLanguage.level)
        ),
        command.learningLanguages.map(learningLanguageResultToDomain),
        command.objectives.map((goal) => goalCommandToDomain(goal)),
        command.meetingFrequency as MeetFrequency,
        command.interests.map((interest) => new Interest(interest.id, interest.name)),
        {
            anecdote: command.biography.anecdote,
            experience: command.biography.experience,
            favoritePlace: command.biography.favoritePlace,
            superpower: command.biography.superpower,
        },
        {
            monday: command.availabilities.monday as AvailabilitiesOptions,
            tuesday: command.availabilities.tuesday as AvailabilitiesOptions,
            wednesday: command.availabilities.wednesday as AvailabilitiesOptions,
            thursday: command.availabilities.thursday as AvailabilitiesOptions,
            friday: command.availabilities.friday as AvailabilitiesOptions,
            saturday: command.availabilities.saturday as AvailabilitiesOptions,
            sunday: command.availabilities.sunday as AvailabilitiesOptions,
        },
        userResultToDomain(command.user),
        command.availabilitiesNote,
        command.availabilitiesNotePrivacy
    );
};

export default ProfileCommand;
