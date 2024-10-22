import Vocabulary from '../../entities/Vocabulary';

interface GetVocabulariesFromListsIdUsecaseInterface {
    execute(vocabularyListsId: string[]): Promise<Vocabulary[] | Error>;
}

export default GetVocabulariesFromListsIdUsecaseInterface;
