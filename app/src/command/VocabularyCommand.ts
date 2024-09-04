import Vocabulary from '../domain/entities/Vocabulary';

interface VocabularyCommand {
    id: string;
    word: string;
    translation: string;
    pronunciationWordUrl: string;
    pronunciationTranslationUrl: string;
}

export const vocabularyCommandToDomain = (command: VocabularyCommand) => {
    return new Vocabulary(
        command.id,
        command.word,
        command.translation,
        command.pronunciationWordUrl,
        command.pronunciationTranslationUrl
    );
};

export default VocabularyCommand;
