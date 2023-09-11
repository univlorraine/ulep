import * as Prisma from '@prisma/client';
import {
  RoutineExecution,
  RoutineStatus,
} from 'src/core/models/routine-execution.model';

const routineExecutionMapper = (
  instance: Prisma.RoutineExecutions,
): RoutineExecution =>
  new RoutineExecution({
    id: instance.id,
    sponsorId: instance.sponsor_id,
    createdAt: instance.created_at,
    status: RoutineStatus[instance.status],
  });

export default routineExecutionMapper;
