interface ShareLogEntriesForResearchUsecaseInterface {
    execute(learningLanguageId: string): Promise<void | Error>;
}

export default ShareLogEntriesForResearchUsecaseInterface;
