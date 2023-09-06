import qsAdapter from '../providers/qsAdapter';

export interface LearningLanguagesParams {
    filter: {
        universityIds: string[];
    };
    pagination: {
        page: string;
        perPage: string;
    };
}

const LearningLanguagesQuery = (params: LearningLanguagesParams): string => {
    const query = {
        universityIds: params.filter.universityIds,
        page: params.pagination.page,
        limit: params.pagination.perPage,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default LearningLanguagesQuery;
