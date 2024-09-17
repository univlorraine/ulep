interface DeleteVocabularyUsecaseInterface {
    execute(id: string): Promise<void | Error>;
}

export default DeleteVocabularyUsecaseInterface;
