import { LogEntriesByDates } from '../../entities/LogEntry';

export const DEFAULT_LOG_ENTRIES_PAGE_SIZE = 10;
export type GetLogEntriesUsecaseParams = {
    userId: string;
    page: number;
};

interface GetLogEntriesUsecaseInterface {
    execute(params: GetLogEntriesUsecaseParams): Promise<LogEntriesByDates[] | Error>;
}

export default GetLogEntriesUsecaseInterface;
