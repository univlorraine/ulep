import qsAdapter from '../providers/qsAdapter';

interface InterestsParams {
    pagination: {
        page: string;
        perPage: string;
    };
    sort: {
        order: string;
    };
}

const InterestsQuery = (params: InterestsParams): string => {
    const query = {
        page: params.pagination.page,
        limit: params.pagination.perPage,
        order: params.sort.order.toLowerCase(),
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default InterestsQuery;
