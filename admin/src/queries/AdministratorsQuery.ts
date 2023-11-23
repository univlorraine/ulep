import qsAdapter from '../providers/qsAdapter';

export interface AdministratorsParams {
    filter: {
        universityId?: string;
    };
}

const AdministratorsQuery = (params: AdministratorsParams) => {
    const query = {
        universityId: params.filter.universityId,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default AdministratorsQuery;
