import Profile from '../domain/entities/Profile';
//TODO: Change this later when api will be ready
interface ProfileCommand {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    age: number;
    gender: string;
    university: string;
    role: string;
    nativeLanguage: {
        code: string;
        name: string;
    };
    learningLanguage: {
        code: string;
        name: string;
        level: string;
    };
    goals: string[];
    meetingFrequency: string;
    interests: string[];
    bios: string[];
    avatar: string;
}

export const profileCommandToDomain = (command: ProfileCommand) => {
    return new Profile(
        command.id,
        command.email,
        command.firstname,
        command.lastname,
        command.age,
        command.gender as Gender,
        command.university,
        command.role as Role,
        command.nativeLanguage.code,
        command.learningLanguage.code,
        command.goals,
        command.meetingFrequency as MeetFrequency,
        command.interests,
        command.bios,
        command.avatar
    );
};

export default ProfileCommand;
