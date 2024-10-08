import qsAdapter from '../providers/qsAdapter';

export interface ActivitiesCategoriesParams {
    pagination: {
        page: string;
        perPage: string;
    };
}

const ActivitiesCategoriesQuery = (params: ActivitiesCategoriesParams): string => {
    const query = {
        page: params.pagination.page,
        limit: params.pagination.perPage,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default ActivitiesCategoriesQuery;
