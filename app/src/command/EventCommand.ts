import EventObject, { EventStatus, EventType } from '../domain/entities/Event';
import { NewsTranslation } from '../domain/entities/News';
import LanguageCommand, { languageCommandToDomain } from './LanguageCommand';
import UniversityCommand, { universityCommandToDomain } from './UniversityCommand';

export interface EventCommand {
    id: string;
    title: string;
    content: string;
    translations: { languageCode: string; title: string; content: string }[];
    authorUniversity: UniversityCommand;
    languageCode: string;
    status: string;
    startDate: Date;
    endDate: Date;
    type: string;
    withSubscription: boolean;
    isUserSubscribed: boolean;
    diffusionLanguages: LanguageCommand[];
    imageUrl?: string;
    creditImage?: string;
    eventURL?: string;
    address?: string;
    addressName?: string;
    deepLink?: string;
}

export const eventCommandToDomain = (command: EventCommand) => {
    return new EventObject(
        command.id,
        command.title,
        command.content,
        command.translations.map(
            (translation) => new NewsTranslation(translation.languageCode, translation.title, translation.content)
        ),
        universityCommandToDomain(command.authorUniversity),
        command.languageCode,
        command.status as EventStatus,
        command.startDate,
        command.endDate,
        command.type as EventType,
        command.withSubscription,
        command.isUserSubscribed,
        command.diffusionLanguages.map(languageCommandToDomain),
        command.imageUrl,
        command.creditImage,
        command.eventURL,
        command.address,
        command.addressName,
        command.deepLink
    );
};
