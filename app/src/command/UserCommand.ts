import { AvatarPlaceholderPng } from '../assets';
import User from '../domain/entities/User';
import UniversityCommand, { universityCommandToDomain } from './UniversityCommand';

interface UserCommand {
    id: string;
    avatar?: { id: string; };
    acceptsEmail: boolean;
    email: string;
    firstname: string;
    lastname: string;
    university: UniversityCommand;
    status: UserStatus;
}

export const userCommandToDomain = (command: UserCommand) => {
    return new User(
        command.id,
        command.email,
        command.firstname,
        command.lastname,
        universityCommandToDomain(command.university),
        command.status,
        command.acceptsEmail,
        command.avatar ? command.avatar.id : undefined
    );
};

export default UserCommand;
