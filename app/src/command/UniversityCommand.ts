import University from '../domain/entities/University';

interface UniversityCommand {
    id: string;
    campus: string[];
    languages: string[];
    name: string;
    parent: string;
    timezone: string;
    website: string;
}

export const universityCommandToDomain = (command: UniversityCommand) => {
    return new University(
        command.id,
        command.name,
        !command.parent,
        command.languages,
        command.timezone,
        command.campus
    );
};

export default UniversityCommand;
