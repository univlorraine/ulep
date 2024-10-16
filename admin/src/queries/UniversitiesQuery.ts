import qsAdapter from '../providers/qsAdapter';

export interface UniversitiesQueryParams {
    sort?: {
        field: string;
        order: string;
    };
}

const UniversitiesQuery = (params: UniversitiesQueryParams): string => {
    const query = {
        field: params.sort?.field,
        order: params.sort?.order.toLowerCase(),
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default UniversitiesQuery;
