import qsAdapter from '../providers/qsAdapter';

export interface ActivitiesParams {
    pagination: {
        page: string;
        perPage: string;
    };
    filter: {
        title?: string;
        languageCode?: string;
        languageLevel?: string;
        category?: string;
        status?: string;
    };
}

const ActivitiesQuery = (params: ActivitiesParams): string => {
    console.log({ params });
    const query = {
        page: params.pagination.page,
        limit: params.pagination.perPage,
        searchTitle: params.filter.title,
        languageCode: params.filter.languageCode,
        languageLevel: params.filter.languageLevel,
        category: params.filter.category,
        status: params.filter.status,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default ActivitiesQuery;
