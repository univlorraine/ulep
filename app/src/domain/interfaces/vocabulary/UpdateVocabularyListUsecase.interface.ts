import VocabularyList from '../../entities/VocabularyList';

export type UpdateVocabularyListCommand = {
    name?: string;
    symbol?: string;
    profileIds?: string[];
};

interface UpdateVocabularyListUsecaseInterface {
    execute(id: string, command: UpdateVocabularyListCommand): Promise<VocabularyList | Error>;
}

export default UpdateVocabularyListUsecaseInterface;
