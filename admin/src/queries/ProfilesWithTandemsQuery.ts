import { LearningType } from '../entities/LearningLanguage';
import qsAdapter from '../providers/qsAdapter';

export interface ProfilesParams {
    filter: {
        user?: {
            lastname?: string;
            university?: string;
            division?: string;
        };
        university?: string; // Use to force university filter when admin is from partner university
        learningLanguage?: string;
        learningType?: LearningType;
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
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default ProfilesQuery;
