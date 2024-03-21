import Campus from './Campus';
import { Profile } from './Profile';
import { TandemStatus, TandemSummary } from './Tandem';

export enum LearningType {
    ETANDEM = 'ETANDEM',
    TANDEM = 'TANDEM',
    BOTH = 'BOTH',
}

export type LearningLanguage = {
    id: string;
    code: string;
    level: string;
    name: string;
    createdAt: Date;
    profile: Profile;
    tandem?: TandemSummary;
    sameGender: boolean;
    learningType: LearningType;
    sameAge: boolean;
    campus?: Campus;
    certificateOption?: boolean;
    specificProgram?: boolean;
    sameTandemEmail?: string;
};

export type LearningLanguageTandem = {
    id: string;
    status: string;
    userLearningLanguage: LearningLanguage;
    partnerLearningLanguage: LearningLanguage;
    universityValidations: string[];
    compatibilityScore: number;
};

/**
 * Return true if an action is possible on a learning language
 * Action possible = a tandem is actionable (validate, refuse, etc)
 * @param learningLanguage
 * @returns
 */
export const learningLanguageHasPossibleAction = (learningLanguage?: LearningLanguage) =>
    learningLanguage?.tandem?.status &&
    learningLanguage?.tandem?.status !== TandemStatus.ACTIVE &&
    learningLanguage?.tandem?.status !== TandemStatus.INACTIVE;

export const getLearningLanguageUniversityAndCampusString = (learningLanguage?: LearningLanguage) => {
    if (!learningLanguage) {
        return '';
    }
    if (learningLanguage.campus) {
        return `${learningLanguage.profile.user.university.name} - ${learningLanguage.campus.name}`;
    }

    return `${learningLanguage.profile.user.university.name}`;
};

export const isJoker = (learningLanguage?: LearningLanguage): boolean => {
    if (learningLanguage?.code === '*') {
        return true;
    }

    return false;
};

export const getEffectiveLearningType = (
    learningLanguage1: LearningLanguage,
    learningLanguage2: LearningLanguage
): LearningType => {
    switch (learningLanguage1.learningType) {
        case LearningType.BOTH:
            if (
                (learningLanguage2.learningType === LearningType.BOTH ||
                    learningLanguage2.learningType === LearningType.TANDEM) &&
                learningLanguage1.campus &&
                learningLanguage1.campus.id === learningLanguage2.campus?.id
            ) {
                return LearningType.TANDEM;
            }

            return LearningType.ETANDEM;
        case LearningType.ETANDEM:
            return learningLanguage1.learningType;
        case LearningType.TANDEM:
            return learningLanguage1.learningType;
        default:
            throw new Error(`Unknown LearningType ${learningLanguage1.learningType}`);
    }
};
