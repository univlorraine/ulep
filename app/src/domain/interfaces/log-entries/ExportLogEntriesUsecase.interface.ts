interface ExportLogEntriesUsecaseInterface {
    execute(learningLanguageId: string): Promise<void | Error>;
}

export default ExportLogEntriesUsecaseInterface;
