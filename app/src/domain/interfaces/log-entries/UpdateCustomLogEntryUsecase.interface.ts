export interface UpdateCustomLogEntryMetadata {
    date?: Date;
    title?: string;
    content?: string;
}

interface UpdateCustomLogEntryUsecaseInterface {
    execute(id: string, metadata: UpdateCustomLogEntryMetadata): Promise<void | Error>;
}

export default UpdateCustomLogEntryUsecaseInterface;
