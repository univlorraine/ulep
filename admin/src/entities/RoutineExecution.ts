export enum RoutineExecutionStatus {
    ON_GOING = 'ON_GOING',
    ERROR = 'ERROR',
    ENDED = 'ENDED',
    CANCELED = 'CANCELED',
}

export type RoutineExecution = {
    id: string;
    status: RoutineExecutionStatus;
    createdAt: Date;
};
