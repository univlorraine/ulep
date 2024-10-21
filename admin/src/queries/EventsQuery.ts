import { NewsStatus } from '../entities/News';
import qsAdapter from '../providers/qsAdapter';

export interface EventsParams {
    filter: {
        authorUniversityId?: string;
        title?: string;
        status?: NewsStatus;
        languageCode?: string;
    };
    pagination: {
        page: string;
        perPage: string;
    };
}

const EventsQuery = (params: EventsParams) => {
    const query = {
        authorUniversityId: params.filter.authorUniversityId,
        title: params.filter.title,
        status: params.filter.status,
        languageCode: params.filter.languageCode,
        page: params.pagination.page,
        limit: params.pagination.perPage,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default EventsQuery;
