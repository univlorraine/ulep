interface DeleteVocabularyListUsecaseInterface {
    execute(id: string): Promise<void | Error>;
}

export default DeleteVocabularyListUsecaseInterface;
