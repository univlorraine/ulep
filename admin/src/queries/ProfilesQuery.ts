interface ProfilesParams {
    filter: {
        country: string,
        email: string,
        role: string,
    },
    pagination: {
        page: string;
        perPage: string;
    },
    sort: {
        field: string,
        order: string,
    }
}

const ProfilesQuery = (url: URL, params: ProfilesParams) => {
    if (params.pagination.page) {
        url.searchParams.append('page', params.pagination.page);
    }

    if (params.pagination.perPage) {
        url.searchParams.append('limit', params.pagination.perPage);
    }

    if (params.sort.field && params.sort.field.indexOf('.') !== -1) {
        url.searchParams.append('field', params.sort.field.split('.')[1]);
    }

    if (params.sort.order) {
        url.searchParams.append('order', params.sort.order.toLowerCase());
    }

    if (params.filter.country) {
        url.searchParams.append('country', params.filter.country);
    }

    if (params.filter.email) {
        url.searchParams.append('email', params.filter.email);
    }

    if (params.filter.role) {
        url.searchParams.append('role', params.filter.role);
    }
};

export default ProfilesQuery;
