import VocabularyList from '../../entities/VocabularyList';

export type CreateVocabularyListCommand = {
    name: string;
    symbol: string;
    profileId: string;
    wordLanguageCode: string;
    translationLanguageCode: string;
};

interface CreateVocabularyListUsecaseInterface {
    execute(command: CreateVocabularyListCommand): Promise<VocabularyList | Error>;
}

export default CreateVocabularyListUsecaseInterface;
