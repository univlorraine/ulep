import University from '../domain/entities/University';
import LanguageCommand, { languageCommandToDomain } from './LanguageCommand';

interface UniversityCommand {
    id: string;
    languages: LanguageCommand[];
    name: string;
    parent: string | undefined;
    sites: string[];
    timezone: string;
    website: string;
}

export const universityCommandToDomain = (command: UniversityCommand) => {
    return new University(
        command.id,
        command.name,
        !command.parent,
        command.languages.map((language) => languageCommandToDomain(language)),
        command.timezone,
        command.sites
    );
};

export default UniversityCommand;
