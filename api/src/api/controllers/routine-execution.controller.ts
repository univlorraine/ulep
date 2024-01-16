import { Controller, Get, Inject, Logger, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, Roles } from '../decorators/roles.decorator';
import { AuthenticationGuard } from '../guards';
import {
  ROUTINE_EXECUTION_REPOSITORY,
  RoutineExecutionRepository,
} from 'src/core/ports/routine-execution.repository';
import { RoutineExecutionResponse } from '../dtos/routine-execution';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';

@Controller('routine-executions')
@ApiTags('RoutineExecution')
export class RoutineExecutionController {
  private readonly logger = new Logger(RoutineExecutionController.name);

  #defaultCancelThresholdInMin: number;

  constructor(
    @Inject(ROUTINE_EXECUTION_REPOSITORY)
    private readonly routineExecutionRepository: RoutineExecutionRepository,
    env: ConfigService<Env, true>,
  ) {
    this.#defaultCancelThresholdInMin = env.get<number>(
      'CANCEL_TRESHOLD_IN_MIN',
      15,
    );
  }

  @Get('/last')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Retrieve last routine execution' })
  @ApiOkResponse({ type: RoutineExecutionResponse })
  async getLast(): Promise<RoutineExecutionResponse | Record<string, any>> {
    const res = await this.routineExecutionRepository.getLast();
    if (!res) {
      return {};
    }

    const tresholdDate = new Date(
      Date.now() - 1000 * 60 * this.#defaultCancelThresholdInMin,
    );

    await this.routineExecutionRepository.cleanOldRoutines(tresholdDate);

    return RoutineExecutionResponse.fromDomain(res);
  }
}
