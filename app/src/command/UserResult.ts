import User from '../domain/entities/User';
import MediaObjectCommand, { mediaObjectCommandToDomain } from './MediaObjectCommand';
import UniversityCommand, { universityCommandToDomain } from './UniversityCommand';

interface UserResult {
    id: string;
    avatar?: MediaObjectCommand;
    acceptsEmail: boolean;
    email: string;
    firstname: string;
    lastname: string;
    university: UniversityCommand;
    status: UserStatus;
    staffFunction: string;
    role: Role;
    gender: Gender;
    division: string;
    diploma: string;
    country: string;
    age: number;
}

export const userResultToDomain = (command: UserResult) => {
    return new User(
        command.id,
        command.email,
        command.firstname,
        command.lastname,
        command.status,
        command.staffFunction,
        command.role,
        command.gender,
        command.division,
        command.diploma,
        command.country,
        command.age,
        universityCommandToDomain(command.university),
        command.acceptsEmail,
        command.avatar ? mediaObjectCommandToDomain(command.avatar) : undefined
    );
};

export default UserResult;
