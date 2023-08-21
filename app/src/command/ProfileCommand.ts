import { Interest } from '../domain/entities/CategoryInterests';
import Profile from '../domain/entities/Profile';
import { goalCommandToDomain } from './GoalCommand';
import UserCommand, { userCommandToDomain } from './UserCommand';

interface ProfileCommand {
    id: string;
    interests: { id: string; name: string }[];
    nativeLanguage: {
        code: string;
    };
    learningLanguage: {
        code: string;
        level: string;
    };
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
        command.nativeLanguage.code,
        command.learningLanguage.code,
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
