import Campus from '../domain/entities/Campus';
import University from '../domain/entities/University';
import LanguageCommand, { languageCommandToDomain } from './LanguageCommand';

interface UniversityCommand {
    id: string;
    name: string;
    parent: string | undefined;
    sites: { id: string; name: string }[];
    timezone: string;
    website: string;
    admissionStart: Date;
    admissionEnd: Date;
    codes: string[];
    domains: string[];
}

export const universityCommandToDomain = (command: UniversityCommand) => {
    return new University(
        command.id,
        command.name,
        !command.parent,
        command.timezone,
        command.sites.map((site) => new Campus(site.id, site.name)),
        new Date(command.admissionStart),
        new Date(command.admissionEnd),
        command.codes,
        command.domains
    );
};

export default UniversityCommand;
