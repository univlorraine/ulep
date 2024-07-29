import qsAdapter from '../providers/qsAdapter';

export interface ChatParams {
    pagination: {
        page: number;
        perPage: number;
    };
    filter: {
        lastname?: string;
        firstname?: string;
    };
}

const ChatQuery = (params: ChatParams) => {
    const query = {
        page: params.pagination.page,
        limit: params.pagination.perPage,
        firstname: params.filter.firstname,
        lastname: params.filter.lastname,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default ChatQuery;
