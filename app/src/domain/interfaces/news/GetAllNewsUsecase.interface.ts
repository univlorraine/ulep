import News from '../../entities/News';

export const DEFAULT_NEWS_PAGE_SIZE = 10;

export class GetNewsQuery {
    title?: string;
    languageCodes?: string[];
    limit?: number;
    page?: number;
}

interface GetAllNewsUsecaseInterface {
    execute: (filters: GetNewsQuery) => Promise<News[] | Error>;
}

export default GetAllNewsUsecaseInterface;
