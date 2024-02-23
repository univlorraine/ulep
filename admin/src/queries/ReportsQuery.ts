import qsAdapter from '../providers/qsAdapter';

export interface ReportsParams {
    filter: {
        universityId?: string;
        status: string;
    };
    pagination: {
        page: string;
        perPage: string;
    };
    sort: {
        field?: string;
        order: string;
    };
}

const handleOrderField = (field?: string) => {
    switch (field) {
        case 'user.firstname':
            return 'firstname';
        case 'user.lastname':
            return 'lastname';
        case 'user.university.name':
            return 'university';
        case 'category.name':
            return 'category';
        case 'status':
        case 'content':
        case 'createdAt':
            return field;
        default:
            return undefined;
    }
};

const ReportsQuery = (params: ReportsParams): string => {
    const query = {
        status: params.filter.status,
        universityId: params.filter.universityId,
        page: params.pagination.page,
        limit: params.pagination.perPage,
        field: handleOrderField(params.sort.field),
        order: params.sort.order.toLowerCase(),
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default ReportsQuery;
