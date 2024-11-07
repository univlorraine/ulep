import Campus from '../domain/entities/Campus';
import University from '../domain/entities/University';

interface UniversityCommand {
    id: string;
    name: string;
    parent: string | undefined;
    sites: { id: string; name: string }[];
    hasCode: boolean;
    isCodeMandatory: boolean;
    timezone: string;
    website: string;
    admissionStart: Date;
    admissionEnd: Date;
    openServiceDate: Date;
    closeServiceDate: Date;
    maxTandemsPerUser: number;
    logo?: { id: string; mimeType: string };
}

export const universityCommandToDomain = (command: UniversityCommand) => {
    return new University(
        command.id,
        command.name,
        !command.parent,
        command.timezone,
        command.sites.map((site) => new Campus(site.id, site.name)),
        command.hasCode,
        command.isCodeMandatory,
        new Date(command.admissionStart),
        new Date(command.admissionEnd),
        new Date(command.openServiceDate),
        new Date(command.closeServiceDate),
        command.maxTandemsPerUser,
        command.logo?.id
    );
};

export default UniversityCommand;
