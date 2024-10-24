import EventObject, { EventType } from '../../entities/Event';

export const DEFAULT_EVENTS_PAGE_SIZE = 10;

export class GetEventsQuery {
    title?: string;
    languageCodes?: string[];
    type?: EventType;
    limit?: number;
    page?: number;
}

interface GetAllEventsUsecaseInterface {
    execute: (filters: GetEventsQuery) => Promise<EventObject[] | Error>;
}

export default GetAllEventsUsecaseInterface;
