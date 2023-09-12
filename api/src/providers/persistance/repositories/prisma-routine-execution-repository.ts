import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import {
  RoutineExecution,
  RoutineStatus,
} from 'src/core/models/routine-execution.model';
import { RoutineExecutionRepository } from 'src/core/ports/routine-execution.repository';
import routineExecutionMapper from '../mappers/routine-execution.mapper';

@Injectable()
export class PrismaRoutineExecutionRepository
  implements RoutineExecutionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create({ sponsorId, universityIds }): Promise<RoutineExecution> {
    const instance = await this.prisma.routineExecutions.create({
      data: {
        sponsor_id: sponsorId,
        Universities: {
          connect: universityIds.map((id) => ({
            id,
          })),
        },
        status: RoutineStatus.ON_GOING,
      },
    });

    return routineExecutionMapper(instance);
  }

  async updateStatus(
    id: string,
    status: RoutineStatus,
  ): Promise<RoutineExecution> {
    const instance = await this.prisma.routineExecutions.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return routineExecutionMapper(instance);
  }

  async getLast(): Promise<RoutineExecution> {
    const res = await this.prisma.routineExecutions.findFirst({
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!res) {
      return null;
    }

    return routineExecutionMapper(res);
  }

  async cleanOldRoutines(tresholdDate: Date): Promise<void> {
    await this.prisma.routineExecutions.updateMany({
      where: {
        status: RoutineStatus.ON_GOING,
        updated_at: {
          lte: tresholdDate,
        },
      },
      data: {
        status: RoutineStatus.CANCELED,
      },
    });
  }
}
