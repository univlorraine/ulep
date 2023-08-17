import qsAdapter from '../providers/qsAdapter';

interface ReportsParams {
    filter: {
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
        default:
            return undefined;
    }
};

const ReportsQuery = (params: ReportsParams): string => {
    const query = {
        where: { status: params.filter.status },
        page: params.pagination.page,
        limit: params.pagination.perPage,
        field: handleOrderField(params.sort.field),
        order: params.sort.order.toLowerCase(),
    };
    console.warn(params);

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default ReportsQuery;
