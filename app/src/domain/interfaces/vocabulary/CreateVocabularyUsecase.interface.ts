import Vocabulary from '../../entities/Vocabulary';

export type CreateVocabularyCommand = {
    word: string;
    translation: string;
    vocabularyListId: string;
    wordPronunciation?: File;
    translationPronunciation?: File;
};

interface CreateVocabularyUsecaseInterface {
    execute(command: CreateVocabularyCommand): Promise<Vocabulary | Error>;
}

export default CreateVocabularyUsecaseInterface;
