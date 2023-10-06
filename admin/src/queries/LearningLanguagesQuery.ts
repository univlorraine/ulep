import qsAdapter from '../providers/qsAdapter';

export interface LearningLanguagesParams {
    filter: {
        universityIds: string[];
        hasActiveTandem?: boolean;
        hasActionableTandem?: boolean;
    };
    pagination: {
        page: string;
        perPage: string;
    };
    sort?: {
        field: string;
        order: string;
    };
}

const handleOrderField = (field?: string) => {
    switch (field) {
        case 'profile.name':
            return 'profile';
        case 'name':
            return 'language';
        case 'profile.user.university.name':
            return 'university';
        case 'profile.user.role':
            return 'role';
        case 'level':
        case 'createdAt':
        case 'activeTandem':
        case 'specificProgram':
            return field;
        default:
            return undefined;
    }
};

export const LearningLanguagesQuery = (params: LearningLanguagesParams): string => {
    const query = {
        universityIds: params.filter.universityIds,
        hasActiveTandem: params.filter.hasActiveTandem,
        hasActionableTandem: params.filter.hasActionableTandem,
        page: params.pagination.page,
        limit: params.pagination.perPage,
        field: handleOrderField(params.sort?.field),
        order: params.sort?.order?.toLowerCase(),
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export interface LearningLanguageMatchesParams {
    filter: {
        id: string;
        universityIds: string[];
    };
}

export const LearningLanguageMatchesQuery = (params: LearningLanguagesParams): string => {
    const query = {
        universityIds: params.filter.universityIds,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default LearningLanguagesQuery;
