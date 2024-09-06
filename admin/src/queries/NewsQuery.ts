import { NewsStatus } from '../entities/News';
import qsAdapter from '../providers/qsAdapter';

export interface NewsParams {
    filter: {
        universityId?: string;
        title?: string;
        status?: NewsStatus;
        languageCode?: string;
    };
}

const NewsQuery = (params: NewsParams) => {
    const query = {
        universityId: params.filter.universityId,
        title: params.filter.title,
        status: params.filter.status,
        languageCode: params.filter.languageCode,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default NewsQuery;
