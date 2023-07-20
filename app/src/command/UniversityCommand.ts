import University from '../domain/entities/University';

interface UniversityCommand {
    id: string;
    name: string;
    isCentral: boolean;
}

export const universityCommandToDomain = (command: UniversityCommand) => {
    return new University(command.id, command.name, command.isCentral);
};

export default UniversityCommand;
