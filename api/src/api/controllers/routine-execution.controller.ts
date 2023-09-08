import { Controller, Get, Inject, Logger, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { configuration } from 'src/configuration';
import { AuthenticationGuard } from '../guards';
import {
  ROUTINE_EXECUTION_REPOSITORY,
  RoutineExecutionRepository,
} from 'src/core/ports/routine-execution.repository';
import { RoutineExecutionResponse } from '../dtos/routine-execution';

@Controller('routine-executions')
@ApiTags('RoutineExecution')
export class RoutineExecutionController {
  private readonly logger = new Logger(RoutineExecutionController.name);

  constructor(
    @Inject(ROUTINE_EXECUTION_REPOSITORY)
    private readonly routineExecutionRepository: RoutineExecutionRepository,
  ) {}

  @Get('/last')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Retrieve last routine execution' })
  @ApiOkResponse({ type: RoutineExecutionResponse })
  async getLast(): Promise<RoutineExecutionResponse> {
    const res = await this.routineExecutionRepository.getLast();
    if (!res) {
      return null;
    }

    return RoutineExecutionResponse.fromDomain(res);
  }
}
