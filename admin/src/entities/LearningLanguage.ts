import Campus from './Campus';
import MediaObject from './MediaObject';
// eslint-disable-next-line import/no-cycle
import { Profile } from './Profile';
// eslint-disable-next-line import/no-cycle
import { Tandem, TandemStatus, TandemWithPartnerLearningLanguage } from './Tandem';

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
    tandem?: Tandem;
    sameGender: boolean;
    learningType: LearningType;
    sameAge: boolean;
    campus?: Campus;
    certificateOption?: boolean;
    specificProgram?: boolean;
    hasPriority?: boolean;
    learningJournal?: boolean;
    consultingInterview?: boolean;
    sharedCertificate?: boolean;
    certificateFile?: MediaObject;
    sameTandemEmail?: string;
    sharedLogsDate?: Date;
};

export type LearningLanguageWithTandemWithPartnerProfile = {
    id: string;
    code: string;
    level: string;
    name: string;
    createdAt: Date;
    profile: Profile;
    tandem?: TandemWithPartnerLearningLanguage;
    sameGender: boolean;
    learningType: LearningType;
    sameAge: boolean;
    campus?: Campus;
    certificateOption?: boolean;
    specificProgram?: boolean;
    hasPriority?: boolean;
    sameTandemEmail?: string;
};

export type LearningLanguageTandem = {
    id: string;
    status: TandemStatus;
    userLearningLanguage: LearningLanguage;
    partnerLearningLanguage: LearningLanguage;
    universityValidations: string[];
    compatibilityScore: number;
};

export type CertificateFormPayload = {
    learningJournal?: boolean;
    consultingInterview?: boolean;
    sharedCertificate?: boolean;
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
    learningLanguage?.tandem?.status !== TandemStatus.PAUSED &&
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

export const isJoker = (
    learningLanguage?: LearningLanguage | LearningLanguageWithTandemWithPartnerProfile
): boolean => {
    if (learningLanguage?.code === '*') {
        return true;
    }

    return false;
};

export const getEffectiveLearningType = (
    learningLanguage1: LearningLanguage | LearningLanguageWithTandemWithPartnerProfile,
    learningLanguage2: LearningLanguage | LearningLanguageWithTandemWithPartnerProfile
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
