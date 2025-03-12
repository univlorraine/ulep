interface ExportLogEntriesUsecaseInterface {
    execute(learningLanguageId: string, fileName: string): Promise<void | Error>;
}

export default ExportLogEntriesUsecaseInterface;
