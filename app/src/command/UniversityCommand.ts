import Campus from '../domain/entities/Campus';
import University from '../domain/entities/University';
import LanguageCommand, { languageCommandToDomain } from './LanguageCommand';

interface UniversityCommand {
    id: string;
    languages: LanguageCommand[];
    name: string;
    parent: string | undefined;
    sites: { id: string; name: string }[];
    timezone: string;
    website: string;
}

export const universityCommandToDomain = (command: UniversityCommand) => {
    return new University(
        command.id,
        command.name,
        !!command.parent,
        command.languages.map((language) => languageCommandToDomain(language)),
        command.timezone,
        command.sites.map((site) => new Campus(site.id, site.name))
    );
};

export default UniversityCommand;
