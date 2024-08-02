interface CreateReportMessageUsecaseInterface {
    execute(content: string): Promise<void | Error>;
}
export default CreateReportMessageUsecaseInterface;
