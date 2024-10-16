import News, { NewsStatus, NewsTranslation } from '../domain/entities/News';
import UniversityCommand, { universityCommandToDomain } from './UniversityCommand';

export interface NewsCommand {
    id: string;
    title: string;
    content: string;
    translations: { languageCode: string; title: string; content: string }[];
    languageCode: string;
    university: UniversityCommand;
    status: string;
    startPublicationDate: Date;
    endPublicationDate: Date;
    imageURL?: string;
}

export const newsCommandToDomain = (command: NewsCommand) => {
    return new News(
        command.id,
        command.title,
        command.content,
        command.translations.map(
            (translation) => new NewsTranslation(translation.languageCode, translation.title, translation.content)
        ),
        command.languageCode,
        universityCommandToDomain(command.university),
        command.status as NewsStatus,
        command.startPublicationDate,
        command.endPublicationDate,
        command.imageURL
    );
};
