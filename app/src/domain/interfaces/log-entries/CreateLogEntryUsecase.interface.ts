import { GameName, LogEntryType } from '../../entities/LogEntry';

interface CreateLogEntryMetadata {
    date?: Date;
    title?: string;
    content?: string;
    duration?: number;
    tandemFirstname?: string;
    tandemLastname?: string;
    partnerTandemId?: string;
    percentage?: number;
    gameName?: GameName;
}

export interface CreateLogEntryProps {
    type: LogEntryType;
    metadata: CreateLogEntryMetadata;
    createdAt?: Date;
}

interface CreateLogEntryUsecaseInterface {
    execute(command: CreateLogEntryProps): Promise<void | Error>;
}

export default CreateLogEntryUsecaseInterface;
