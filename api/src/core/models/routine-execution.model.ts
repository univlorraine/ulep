import { University } from './university.model';

export enum RoutineStatus {
  ON_GOING = 'ON_GOING',
  ERROR = 'ERROR',
  ENDED = 'ENDED',
  CANCELED = 'CANCELED',
}

interface RoutineExecutionParams {
  id: string;
  sponsorId: string;
  status: RoutineStatus;
  createdAt: Date;
  universities?: University[];
}

export class RoutineExecution {
  readonly id: string;
  readonly sponsorId: string;
  readonly status: RoutineStatus;
  readonly createdAt: Date;
  readonly universities?: University[];

  constructor({
    id,
    sponsorId,
    status,
    createdAt,
    universities,
  }: RoutineExecutionParams) {
    this.id = id;
    this.sponsorId = sponsorId;
    this.status = status;
    this.createdAt = createdAt;
    this.universities = universities;
  }
}
