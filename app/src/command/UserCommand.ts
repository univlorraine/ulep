import { AvatarPlaceholderPng } from '../assets';
import MediaObject from '../domain/entities/MediaObject';
import User from '../domain/entities/User';
import MediaObjectCommand, { mediaObjectCommandToDomain } from './MediaObjectCommand';
import UniversityCommand, { universityCommandToDomain } from './UniversityCommand';

interface UserCommand {
    id: string;
    avatar?: MediaObjectCommand;
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
        command.status,
        universityCommandToDomain(command.university),
        command.acceptsEmail,
        command.avatar ? mediaObjectCommandToDomain(command.avatar) : undefined
    );
};

export default UserCommand;
