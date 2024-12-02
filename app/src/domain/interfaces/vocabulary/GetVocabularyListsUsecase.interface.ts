import VocabularyList from '../../entities/VocabularyList';

interface GetVocabularyListsUsecaseInterface {
    execute(profileId: string, languageCode?: string): Promise<VocabularyList[] | Error>;
}

export default GetVocabularyListsUsecaseInterface;
