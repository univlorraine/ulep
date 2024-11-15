interface UpdateCustomLogEntryUsecaseInterface {
    execute(id: string, content: string): Promise<void | Error>;
}

export default UpdateCustomLogEntryUsecaseInterface;
