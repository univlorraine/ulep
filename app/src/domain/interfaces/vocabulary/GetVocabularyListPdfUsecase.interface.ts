interface GetVocabularyListPdfUsecaseInterface {
    execute(vocabularyListId: string, vocabularyListName: string): Promise<any>;
}

export default GetVocabularyListPdfUsecaseInterface;
