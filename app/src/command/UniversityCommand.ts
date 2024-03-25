import Campus from '../domain/entities/Campus';
import University from '../domain/entities/University';
import LanguageCommand, { languageCommandToDomain } from './LanguageCommand';

interface UniversityCommand {
    id: string;
    name: string;
    parent: string | undefined;
    sites: { id: string; name: string }[];
    hasCode: boolean;
    timezone: string;
    website: string;
    admissionStart: Date;
    admissionEnd: Date;
    openServiceDate: Date;
    closeServiceDate: Date;
    maxTandemsPerUser: number;
}

export const universityCommandToDomain = (command: UniversityCommand) => {
    return new University(
        command.id,
        command.name,
        !command.parent,
        command.timezone,
        command.sites.map((site) => new Campus(site.id, site.name)),
        command.hasCode,
        new Date(command.admissionStart),
        new Date(command.admissionEnd),
        new Date(command.openServiceDate),
        new Date(command.closeServiceDate),
        command.maxTandemsPerUser
    );
};

export default UniversityCommand;
