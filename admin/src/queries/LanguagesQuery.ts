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
    filter: {
        code: string;
        name: string;
    };
}

const LanguagesQuery = (params: LanguagesParams): string => {
    const query = {
        page: params.pagination.page,
        limit: params.pagination.perPage,
        field: params.sort.field || 'code',
        order: params.sort.order.toLowerCase(),
        code: params.filter.code,
        name: params.filter.name,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default LanguagesQuery;
