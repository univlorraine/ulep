export enum TandemStatus {
    INACTIVE = 'INACTIVE',
    DRAFT = 'DRAFT',
    VALIDATED_BY_ONE_UNIVERSITY = 'VALIDATED_BY_ONE_UNIVERSITY',
    ACTIVE = 'ACTIVE',
}

export type TandemSummary = {
    id: string;
    status: TandemStatus;
};

export const isTandemActive = (tandem?: TandemSummary) => tandem?.status === TandemStatus.ACTIVE;
