import VocabularyList from '../domain/entities/VocabularyList';
import LanguageCommand, { languageCommandToDomain } from './LanguageCommand';

interface VocabularyListCommand {
    id: string;
    name: string;
    symbol: string;
    wordLanguage: LanguageCommand;
    translationLanguage: LanguageCommand;
    creatorId: string;
    creatorName: string;
    missingPronunciationOfWords: number;
    missingPronunciationOfTranslations: number;
    numberOfVocabularies: number;
    isEditable: boolean;
    editorsIds: string[];
}

export const vocabularyListCommandToDomain = (command: VocabularyListCommand) => {
    return new VocabularyList(
        command.id,
        command.name,
        command.symbol,
        command.editorsIds,
        languageCommandToDomain(command.wordLanguage),
        languageCommandToDomain(command.translationLanguage),
        command.creatorId,
        command.creatorName,
        command.missingPronunciationOfWords,
        command.missingPronunciationOfTranslations,
        command.numberOfVocabularies,
        command.isEditable
    );
};

export default VocabularyListCommand;
