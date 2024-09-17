import Vocabulary from '../../entities/Vocabulary';

export interface UpdateVocabularyCommand {
    word?: string;
    translation?: string;
    wordPronunciation?: File;
    translationPronunciation?: File;
    deletePronunciationWord?: boolean;
    deletePronunciationTranslation?: boolean;
}

interface UpdateVocabularyUsecaseInterface {
    execute(id: string, command: UpdateVocabularyCommand): Promise<Vocabulary | Error>;
}

export default UpdateVocabularyUsecaseInterface;
