import { EventStatus, EventType } from '../entities/Event';
import qsAdapter from '../providers/qsAdapter';

export interface EventsParams {
    filter: {
        authorUniversityId?: string;
        title?: string;
        status?: EventStatus;
        type?: EventType;
        languageCode?: string;
    };
    pagination: {
        page: string;
        perPage: string;
    };
    sort?: {
        field: string;
        order: string;
    };
}

const EventsQuery = (params: EventsParams) => {
    const query = {
        authorUniversityId: params.filter.authorUniversityId,
        title: params.filter.title,
        status: params.filter.status,
        languageCode: params.filter.languageCode,
        types: [params.filter.type],
        page: params.pagination.page,
        limit: params.pagination.perPage,
        field: params.sort?.field,
        order: params.sort?.order.toLowerCase(),
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default EventsQuery;
