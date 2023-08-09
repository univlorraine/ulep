import qsAdapter from '../providers/qsAdapter';

interface ProfilesParams {
    filter: {
        user: {
            country?: string,
            email?: string,
            firstname?: string,
            lastname?: string,
            role?: string,
            university?: string,
        },
        masteredLanguageCode?: string,
        nativeLanguageCode?: string,
    },
    pagination: {
        page: string;
        perPage: string;
    },
    sort: {
        field?: string,
        order: string,
    }
}

const ProfilesQuery = (params: ProfilesParams): string => {
    const query = {
        where: {
            user: params.filter.user ? {
                country: params.filter.user.country,
                email: params.filter.user.email,
                firstname: params.filter.user.firstname,
                lastname: params.filter.user.lastname,
                role: params.filter.user.role,
                university: params.filter.user.university,
            } : {},
            masteredLanguageCode: params.filter.masteredLanguageCode,
            nativeLanguageCode: params.filter.nativeLanguageCode,
        },
        page: params.pagination.page,
        limit: params.pagination.perPage,
        field: params.sort.field,
        order: params.sort.order.toLowerCase(),
    };

    return (new URLSearchParams(qsAdapter().stringify(query)).toString());
};

export default ProfilesQuery;
