import qsAdapter from '../providers/qsAdapter';

export interface AdministratorsParams {
    filter: {
        email?: string;
        firstname?: string;
        lastname?: string;
        groupId?: string;
        universityId?: string;
    };
}

const AdministratorsQuery = (params: AdministratorsParams) => {
    const query = {
        email: params.filter.email,
        firstname: params.filter.firstname,
        lastname: params.filter.lastname,
        groupId: params.filter.groupId,
        universityId: params.filter.universityId,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default AdministratorsQuery;
