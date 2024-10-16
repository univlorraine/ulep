import News from '../../entities/News';

export const DEFAULT_NEWS_PAGE_SIZE = 10;

export class GetNewsQuery {
    universityId?: string;
    title?: string;
    languageCode?: string;
    page?: number;
}

interface GetAllNewsUsecaseInterface {
    execute: (filters: GetNewsQuery) => Promise<News[] | Error>;
}

export default GetAllNewsUsecaseInterface;
