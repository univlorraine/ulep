import University from '../domain/entities/University';

interface UniversityCommand {
    id: string;
    name: string;
}

export const universityCommandToDomain = (command: UniversityCommand) => {
    return new University(command.id, command.name);
};

export default UniversityCommand;
