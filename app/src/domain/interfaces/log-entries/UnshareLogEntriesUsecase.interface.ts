interface UnshareLogEntriesUsecaseInterface {
    execute(learningLanguageId: string): Promise<void | Error>;
}

export default UnshareLogEntriesUsecaseInterface;
