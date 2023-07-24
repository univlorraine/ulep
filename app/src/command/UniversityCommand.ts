import University from '../domain/entities/University';

interface UniversityCommand {
    id: string;
    name: string;
    isCentral: boolean;
}

export const universityCommandToDomain = (command: UniversityCommand) => {
    return new University(command.id, command.name, true, ['Campus A', 'Campus B']); //TODO: change this later when isCentral will be sent
};

export default UniversityCommand;
