import qsAdapter from '../providers/qsAdapter';

interface CountriesParams {
    enable?: boolean;
    pagination?: boolean;
    order?: 'ASC' | 'DESC';
}

const CountriesQuery = (params: CountriesParams) => {
    const query = {
        enable: params.enable ? params.enable.toString() : undefined,
        pagination: params.pagination ? params.pagination.toString() : undefined,
        order: params.order?.toLowerCase(),
    };

    return (new URLSearchParams(qsAdapter().stringify(query)).toString());
};

export default CountriesQuery;
