import EventObject, { EventType } from '../domain/entities/Event';
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
    startDate: Date;
    endDate: Date;
    type: string;
    withSubscription: boolean;
    isUserSubscribed: boolean;
    diffusionLanguages: LanguageCommand[];
    imageURL?: string;
    imageCredit?: string;
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
        command.startDate,
        command.endDate,
        command.type as EventType,
        command.withSubscription,
        command.isUserSubscribed,
        command.diffusionLanguages.map(languageCommandToDomain),
        command.imageURL,
        command.imageCredit,
        command.eventURL,
        command.address,
        command.addressName,
        command.deepLink
    );
};
