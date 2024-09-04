import Vocabulary from '../../entities/Vocabulary';

interface GetVocabulariesUsecaseInterface {
    execute(vocabularyListId: string): Promise<Vocabulary[] | Error>;
}

export default GetVocabulariesUsecaseInterface;
