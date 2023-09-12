import qsAdapter from '../providers/qsAdapter';

export interface LanguagesParams {
    pagination: {
        page: string;
        perPage: string;
    };
    sort: {
        field?: string;
        order: string;
    };
}

const LanguagesQuery = (params: LanguagesParams): string => {
    const query = {
        page: params.pagination.page,
        limit: params.pagination.perPage,
        field: params.sort.field || 'code',
        order: params.sort.order.toLowerCase(),
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default LanguagesQuery;
