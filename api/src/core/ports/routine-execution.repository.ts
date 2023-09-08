import {
  RoutineExecution,
  RoutineStatus,
} from '../models/routine-execution.model';

export const ROUTINE_EXECUTION_REPOSITORY = 'routine-execution.repository';

interface CreateRoutineExecutionParams {
  sponsorId: string;
  universityIds: string[];
}

export interface RoutineExecutionRepository {
  create({
    sponsorId,
    universityIds,
  }: CreateRoutineExecutionParams): Promise<RoutineExecution>;

  updateStatus(id: string, status: RoutineStatus): Promise<RoutineExecution>;

  getLast(): Promise<RoutineExecution>;
}
