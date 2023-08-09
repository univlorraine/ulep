interface CountriesParams {
    enable?: boolean;
    pagination?: boolean;
    order?: 'ASC' | 'DESC';
}

const CountriesQuery = (url: URL, params: CountriesParams) => {
    if (params.enable) {
        url.searchParams.append('enable', params.enable.toString());
    }

    if (params.pagination) {
        url.searchParams.append('pagination', params.pagination.toString());
    }

    if (params.order) {
        url.searchParams.append('order', params.order);
    }
};

export default CountriesQuery;
