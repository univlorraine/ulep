import Vocabulary from '../../entities/Vocabulary';

interface GetVocabulariesUsecaseInterface {
    execute(vocabularyListId: string, search?: string): Promise<Vocabulary[] | Error>;
}

export default GetVocabulariesUsecaseInterface;
