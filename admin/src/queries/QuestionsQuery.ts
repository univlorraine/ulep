import qsAdapter from '../providers/qsAdapter';

interface QuestionsParams {
    filter?: {
        level: string;
    };
    pagination: {
        page: string;
        perPage: string;
    };
}

const QuestionsQuery = (params: QuestionsParams) => {
    const query = {
        level: params.filter?.level,
        page: params.pagination.page,
        limit: params.pagination.perPage,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default QuestionsQuery;
