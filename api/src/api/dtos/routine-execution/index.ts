import { ApiProperty } from '@nestjs/swagger';
import {
  RoutineExecution,
  RoutineStatus,
} from './../../../core/models/routine-execution.model';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class RoutineExecutionResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @ApiProperty({ type: 'string', enum: RoutineStatus })
  @Expose({ groups: ['read'] })
  status: string;

  constructor(partial: Partial<RoutineExecutionResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(
    routineExecution: RoutineExecution,
  ): RoutineExecutionResponse {
    return new RoutineExecutionResponse({
      id: routineExecution.id,
      status: routineExecution.status,
      createdAt: routineExecution.createdAt,
    });
  }
}
