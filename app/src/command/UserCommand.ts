import User from '../domain/entities/User';
import UniversityCommand, { universityCommandToDomain } from './UniversityCommand';

interface UserCommand {
    id: string;
    avatar: { id: string; url: string };
    email: string;
    firstname: string;
    lastname: string;
    university: UniversityCommand;
    status: UserStatus;
}

export const userCommandToDomain = (command: UserCommand) => {
    return new User(
        command.id,
        command.avatar.url,
        command.email,
        command.firstname,
        command.lastname,
        universityCommandToDomain(command.university),
        command.status
    );
};

export default UserCommand;
