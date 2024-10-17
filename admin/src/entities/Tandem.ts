// eslint-disable-next-line import/no-cycle
import { LearningLanguage, LearningType } from './LearningLanguage';

export enum TandemStatus {
    INACTIVE = 'INACTIVE',
    DRAFT = 'DRAFT',
    VALIDATED_BY_ONE_UNIVERSITY = 'VALIDATED_BY_ONE_UNIVERSITY',
    PAUSED = 'PAUSED',
    ACTIVE = 'ACTIVE',
}

export enum WithoutTandem {
    NO_TANDEM = 'NO_TANDEM',
}

export type TandemStatusFilter = TandemStatus | WithoutTandem;

export type Tandem = {
    id: string;
    status: TandemStatus;
    learningType: LearningType;
    learningLanguages: LearningLanguage[];
    compatibilityScore: number;
    universityValidations?: string[];
    createdAt: Date;
    updatedAt: Date;
};

export type TandemWithPartnerLearningLanguage = {
    id: string;
    status: TandemStatus;
    learningType: LearningType;
    partnerLearningLanguage: LearningLanguage;
    compatibilityScore: number;
    universityValidations?: string[];
    createdAt: Date;
    updatedAt: Date;
};

export const isTandemActive = (tandem?: Tandem) => tandem?.status === TandemStatus.ACTIVE;

export const isTandemPaused = (tandem?: Tandem) => tandem?.status === TandemStatus.PAUSED;
