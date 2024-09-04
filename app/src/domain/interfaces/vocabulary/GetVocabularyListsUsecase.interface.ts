import VocabularyList from '../../entities/VocabularyList';

interface GetVocabularyListsUsecaseInterface {
    execute(profileId: string): Promise<VocabularyList[] | Error>;
}

export default GetVocabularyListsUsecaseInterface;
