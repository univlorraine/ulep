import { LearningType } from '../entities/LearningLanguage';
import { TandemStatusFilter } from '../entities/Tandem';
import qsAdapter from '../providers/qsAdapter';

export interface ProfilesParams {
    filter: {
        user?: {
            lastname?: string;
            university?: string;
            division?: string;
        };
        university?: string;
        learningLanguage?: string;
        learningType?: LearningType;
        tandemStatus?: TandemStatusFilter;
    };
    pagination: {
        page: string;
        perPage: string;
    };
}

const ProfilesQuery = (params: ProfilesParams): string => {
    const query = {
        lastname: params.filter.user?.lastname,
        university: params.filter.university || params.filter.user?.university,
        learningLanguage: params.filter.learningLanguage,
        division: params.filter.user?.division,
        page: params.pagination.page,
        limit: params.pagination.perPage,
        learningType: params.filter.learningType,
        tandemStatus: params.filter.tandemStatus,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default ProfilesQuery;
