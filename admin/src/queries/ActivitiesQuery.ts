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
        university?: string;
        theme?: string;
    };
}

const ActivitiesQuery = (params: ActivitiesParams): string => {
    const query = {
        page: params.pagination.page,
        limit: params.pagination.perPage,
        searchTitle: params.filter.title,
        languageCode: params.filter.languageCode,
        languageLevel: params.filter.languageLevel,
        category: params.filter.category,
        theme: params.filter.theme,
        status: params.filter.status,
        university: params.filter.university,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default ActivitiesQuery;
