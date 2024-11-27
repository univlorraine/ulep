import { LogEntry } from '../../entities/LogEntry';

export const DEFAULT_LOG_ENTRIES_BY_DATE_PAGE_SIZE = 10;

export type GetLogEntriesByDateUsecaseParams = {
    userId: string;
    date: Date;
    page: number;
};

interface GetLogEntriesByDateUsecaseInterface {
    execute(params: GetLogEntriesByDateUsecaseParams): Promise<LogEntry[] | Error>;
}

export default GetLogEntriesByDateUsecaseInterface;
