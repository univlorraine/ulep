import Vocabulary from '../../entities/Vocabulary';

export interface UpdateVocabularyCommand {
    word?: string;
    translation?: string;
    pronunciationWord?: File;
    pronunciationTranslation?: File;
}

interface UpdateVocabularyUsecaseInterface {
    execute(id: string, command: UpdateVocabularyCommand): Promise<Vocabulary | Error>;
}

export default UpdateVocabularyUsecaseInterface;
