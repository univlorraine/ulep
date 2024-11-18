import { LogEntryType } from '../../entities/LogEntry';

interface CreateLogEntryMetadata {
    date?: Date;
    title?: string;
    content?: string;
    duration?: number;
    tandemFirstname?: string;
    tandemLastname?: string;
    percentage?: number;
}

export interface CreateLogEntryProps {
    type: LogEntryType;
    metadata: CreateLogEntryMetadata;
}

interface CreateLogEntryUsecaseInterface {
    execute(command: CreateLogEntryProps): Promise<void | Error>;
}

export default CreateLogEntryUsecaseInterface;
