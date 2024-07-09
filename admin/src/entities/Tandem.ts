// eslint-disable-next-line import/no-cycle
import { LearningLanguage } from './LearningLanguage';

export enum TandemStatus {
    INACTIVE = 'INACTIVE',
    DRAFT = 'DRAFT',
    VALIDATED_BY_ONE_UNIVERSITY = 'VALIDATED_BY_ONE_UNIVERSITY',
    PAUSED = 'PAUSED',
    ACTIVE = 'ACTIVE',
}

export type TandemSummary = {
    id: string;
    status: TandemStatus;
    learningLanguages: LearningLanguage[];
    compatibilityScore: number;
    universityValidations?: string[];
    createdAt: Date;
    updatedAt: Date;
};

export const isTandemActive = (tandem?: TandemSummary) => tandem?.status === TandemStatus.ACTIVE;

export const isTandemPaused = (tandem?: TandemSummary) => tandem?.status === TandemStatus.PAUSED;
