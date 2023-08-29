import qsAdapter from '../providers/qsAdapter';

interface LanguagesParams {
    sort: {
        field?: string;
        order: string;
    };
}

const LanguagesQuery = (params: LanguagesParams): string => {
    const query = {
        field: params.sort.field,
        order: params.sort.order.toLowerCase(),
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default LanguagesQuery;
