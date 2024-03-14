import { Interest } from '../domain/entities/CategoryInterests';
import Language from '../domain/entities/Language';
import LearningLanguage from '../domain/entities/LearningLanguage';
import Profile from '../domain/entities/Profile';
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
    availavilitiesNotePrivacy?: boolean;
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
        command.availavilitiesNotePrivacy
    );
};

export default ProfileCommand;
