interface CreateReportUsecaseInterface {
    execute(reportCategoryId: string, content: string): Promise<void | Error>;
}
export default CreateReportUsecaseInterface;
