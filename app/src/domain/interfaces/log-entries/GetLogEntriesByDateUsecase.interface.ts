import { LogEntry } from '../../entities/LogEntry';

interface GetLogEntriesByDateUsecaseInterface {
    execute(userId: string, date: Date): Promise<LogEntry[] | Error>;
}

export default GetLogEntriesByDateUsecaseInterface;
