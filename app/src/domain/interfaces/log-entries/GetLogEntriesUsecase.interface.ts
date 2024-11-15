import { LogEntry } from '../../entities/LogEntry';

interface GetLogEntriesUsecaseInterface {
    execute(userId: string): Promise<LogEntry[] | Error>;
}

export default GetLogEntriesUsecaseInterface;
