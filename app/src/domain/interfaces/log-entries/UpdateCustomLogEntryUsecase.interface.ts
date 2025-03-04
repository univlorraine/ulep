export interface UpdateCustomLogEntryProps {
    id: string;
    learningLanguageId: string;
    metadata: {
        date?: Date;
        title?: string;
        content?: string;
    };
}

interface UpdateCustomLogEntryUsecaseInterface {
    execute(props: UpdateCustomLogEntryProps): Promise<void | Error>;
}

export default UpdateCustomLogEntryUsecaseInterface;
