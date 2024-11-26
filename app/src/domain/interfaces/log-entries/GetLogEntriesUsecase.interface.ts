import { LogEntriesByDates } from '../../entities/LogEntry';

interface GetLogEntriesUsecaseInterface {
    execute(userId: string): Promise<LogEntriesByDates[] | Error>;
}

export default GetLogEntriesUsecaseInterface;
