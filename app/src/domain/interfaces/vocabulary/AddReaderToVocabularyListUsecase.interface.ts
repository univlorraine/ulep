export type AddReaderToVocabularyListCommand = {
    vocabularyListId: string;
    profileId: string;
};

interface AddReaderToVocabularyListUsecaseInterface {
    execute(command: AddReaderToVocabularyListCommand): Promise<void | Error>;
}

export default AddReaderToVocabularyListUsecaseInterface;
