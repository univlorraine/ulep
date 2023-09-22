import * as Prisma from '@prisma/client';
import {
  RoutineExecution,
  RoutineStatus,
} from 'src/core/models/routine-execution.model';
import {
  UniversityRelations,
  UniversitySnapshot,
  universityMapper,
} from './university.mapper';

export const RoutineExecutionRelations = {
  Universities: {
    include: UniversityRelations,
  },
};

export interface RoutineExecutionSnapshot extends Prisma.RoutineExecutions {
  Universities: UniversitySnapshot[];
}

const routineExecutionMapper = (
  instance: RoutineExecutionSnapshot,
): RoutineExecution =>
  new RoutineExecution({
    id: instance.id,
    sponsorId: instance.sponsor_id,
    createdAt: instance.created_at,
    status: RoutineStatus[instance.status],
    universities: instance.Universities.map(universityMapper),
  });

export default routineExecutionMapper;
