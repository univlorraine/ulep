interface ShareLogEntriesUsecaseInterface {
    execute(learningLanguageId: string): Promise<void | Error>;
}

export default ShareLogEntriesUsecaseInterface;
