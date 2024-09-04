import VocabularyList from '../domain/entities/VocabularyList';
import LanguageCommand, { languageCommandToDomain } from './LanguageCommand';
import ProfileCommand, { profileCommandToDomain } from './ProfileCommand';

interface VocabularyListCommand {
    id: string;
    name: string;
    symbol: string;
    profiles: ProfileCommand[];
    wordLanguage: LanguageCommand;
    translationLanguage: LanguageCommand;
}

export const vocabularyListCommandToDomain = (command: VocabularyListCommand) => {
    return new VocabularyList(
        command.id,
        command.name,
        command.symbol,
        command.profiles.map(profileCommandToDomain),
        languageCommandToDomain(command.wordLanguage),
        languageCommandToDomain(command.translationLanguage)
    );
};

export default VocabularyListCommand;
