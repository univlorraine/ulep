// TODO(NOW+1): same import for UC
import { ValidateTandemUsecase } from 'src/core/usecases/tandem/validate-tandem.usecase';
import { RoutineStatus } from 'src/core/models/routine-execution.model';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Collection } from '@app/common';
import { CollectionResponse, CurrentUser } from '../decorators';
import { CreateTandemUsecase } from '../../core/usecases/tandem/create-tandem.usecase';
import { GenerateTandemsUsecase } from '../../core/usecases/tandem/generate-tandems.usecase';
import { GetTandemsUsecase } from '../../core/usecases/tandem/get-tandems.usecase';
import { CreateTandemRequest, PaginationDto, TandemResponse } from '../dtos';
import { Roles } from '../decorators/roles.decorator';
import { configuration } from 'src/configuration';
import { AuthenticationGuard } from '../guards';
import { GenerateTandemsRequest } from '../dtos/tandems/generate-tandems.request';
import { UpdateTandemStatusRequest } from '../dtos/tandems/update-tandem-status.request';
import { UpdateTandemStatusUsecase } from 'src/core/usecases/tandem/update-tandem-status.usecase';
import {
  ROUTINE_EXECUTION_REPOSITORY,
  RoutineExecutionRepository,
} from 'src/core/ports/routine-execution.repository';
import { KeycloakUser } from '@app/keycloak';

@Controller('tandems')
@Swagger.ApiTags('Tandems')
export class TandemController {
  private readonly logger = new Logger(TandemController.name);

  constructor(
    private readonly generateTandemsUsecase: GenerateTandemsUsecase,
    private readonly getTandemsUsecase: GetTandemsUsecase,
    private readonly createTandemUsecase: CreateTandemUsecase,
    private readonly updateTandemStatusUsecase: UpdateTandemStatusUsecase,
    private readonly validateTandemUsecase: ValidateTandemUsecase,
    @Inject(ROUTINE_EXECUTION_REPOSITORY)
    private readonly routineExecutionRepository: RoutineExecutionRepository,
  ) {}

  @Get()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Tandem ressource.',
  })
  @CollectionResponse(TandemResponse)
  async getCollection(
    @Query() { page, limit }: PaginationDto,
  ): Promise<Collection<TandemResponse>> {
    const result = await this.getTandemsUsecase.execute({ page, limit });

    return new Collection<TandemResponse>({
      items: result.items.map(TandemResponse.fromDomain),
      totalItems: result.totalItems,
    });
  }

  @Post()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Creates a Tandem ressource.' })
  async create(
    @CurrentUser() user: KeycloakUser,
    @Body() body: CreateTandemRequest,
  ): Promise<TandemResponse> {
    const tandem = await this.createTandemUsecase.execute({
      adminUniversityId: user.universityId,
      learningLanguageIds: body.learningLanguageIds,
    });
    return TandemResponse.fromDomain(tandem);
  }

  @Post(':id/validate')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Validate a Tandem ressource' })
  async validateTandem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTandemStatusRequest,
  ): Promise<void> {
    await this.updateTandemStatusUsecase.execute({
      id,
      status: body.status,
    });
  }

  @Put(':id/status')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update status of a Tandem ressource' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTandemStatusRequest,
  ): Promise<void> {
    // TODO(NOW+1): remove endpoint and usecase (not used anymore)
    await this.updateTandemStatusUsecase.execute({
      id,
      status: body.status,
    });
  }

  @Post('generate')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Generate Tandems' })
  async generate(
    @CurrentUser() user: KeycloakUser,
    @Body() body: GenerateTandemsRequest,
  ): Promise<void> {
    const routineExecution = await this.routineExecutionRepository.create({
      sponsorId: user.sub,
      universityIds: body.universityIds,
    });
    this.generateTandemsUsecase
      .execute(body)
      .then(() => {
        return this.routineExecutionRepository.updateStatus(
          routineExecution.id,
          RoutineStatus.ENDED,
        );
      })
      .catch((err: unknown) => {
        this.logger.error(
          `Error while generating tandem for universities ${body.universityIds.join(
            ', ',
          )}`,
          err,
        );
        return this.routineExecutionRepository.updateStatus(
          routineExecution.id,
          RoutineStatus.ENDED,
        );
      });

    return null;
  }
}
