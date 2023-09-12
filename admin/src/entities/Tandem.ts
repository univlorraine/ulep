export enum TandemStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DRAFT = 'DRAFT',
}

export type TandemSummary = {
    id: string;
    status: TandemStatus;
};

export const isTandemActive = (tandem?: TandemSummary) => tandem?.status === TandemStatus.ACTIVE;
