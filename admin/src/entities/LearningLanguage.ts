import { Profile } from './Profile';
import { TandemStatus, TandemSummary } from './Tandem';

export type LearningLanguage = {
    id: string;
    code: string;
    level: string;
    name: string;
    createdAt: Date;
    profile: Profile;
    tandem?: TandemSummary;
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
