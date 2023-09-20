import {
  RoutineExecution,
  RoutineStatus,
} from '../models/routine-execution.model';

export const ROUTINE_EXECUTION_REPOSITORY = 'routine-execution.repository';

export interface CreateRoutineExecutionParams {
  sponsorId: string;
  universityIds: string[];
}

export interface GetLastRoutineExecutionParams {
  status?: RoutineStatus;
}

export interface RoutineExecutionRepository {
  create(params: CreateRoutineExecutionParams): Promise<RoutineExecution>;

  updateStatus(id: string, status: RoutineStatus): Promise<RoutineExecution>;

  getLast(params?: GetLastRoutineExecutionParams): Promise<RoutineExecution>;

  cleanOldRoutines(tresholdDate: Date): Promise<void>;
}
