import Campus from './Campus';
import Language from './Language';
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
    tandemLanguage?: Language;
};

export type LearningLanguageTandem = {
    id: string;
    status: string;
    userLearningLanguage: LearningLanguage;
    partnerLearningLanguage: LearningLanguage;
    universityValidations: string[];
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
