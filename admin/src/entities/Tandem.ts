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
};

export const isTandemActive = (tandem?: TandemSummary) => tandem?.status === TandemStatus.ACTIVE;

export const isTandemPaused = (tandem?: TandemSummary) => tandem?.status === TandemStatus.PAUSED;
