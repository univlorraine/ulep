import { Interest } from '../domain/entities/CategoryInterests';
import Language from '../domain/entities/Language';
import Profile from '../domain/entities/Profile';
import { goalCommandToDomain } from './GoalCommand';
import UserCommand, { userCommandToDomain } from './UserCommand';

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
    learningLanguages: {
        id: string;
        code: string;
        level: string;
        name: string;
    }[];
    objectives: {
        id: string;
        name: string;
        image: { id: string; url: string };
    }[];
    meetingFrequency: string;
    biography: {
        anecdote: string;
        experience: string;
        favoritePlace: string;
        superpower: string;
    };
    user: UserCommand;
}

export const profileCommandToDomain = (command: ProfileCommand) => {
    return new Profile(
        command.id,
        new Language(command.nativeLanguage.code, command.nativeLanguage.code, command.nativeLanguage.name),
        command.masteredLanguages.map(
            (masteredLanguage) => new Language(masteredLanguage.code, masteredLanguage.code, masteredLanguage.name)
        ),
        command.learningLanguages.map(
            (learningLanguage) => new Language(learningLanguage.id, learningLanguage.code, learningLanguage.name)
        ),
        command.objectives.map((goal) => goalCommandToDomain(goal)),
        command.meetingFrequency as MeetFrequency,
        command.interests.map((interest) => new Interest(interest.id, interest.name)),
        {
            anecdote: command.biography.anecdote,
            experience: command.biography.experience,
            favoritePlace: command.biography.favoritePlace,
            superpower: command.biography.superpower,
        },
        userCommandToDomain(command.user)
    );
};

export default ProfileCommand;
