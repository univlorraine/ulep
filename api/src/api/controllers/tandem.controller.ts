import {
  ValidateTandemUsecase,
  CreateTandemUsecase,
  GenerateTandemsUsecase,
  GetTandemsUsecase,
  RefuseTandemUsecase,
  UpdateTandemUsecase,
} from 'src/core/usecases/tandem';
import { RoutineStatus } from 'src/core/models/routine-execution.model';
import {
  Body,
  Controller,
  Get,
  Inject,
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
import {
  CreateTandemRequest,
  PaginationDto,
  RefuseTandemRequest,
  TandemResponse,
} from '../dtos';
import { Role, Roles } from '../decorators/roles.decorator';
import { AuthenticationGuard } from '../guards';
import {
  GenerateTandemsRequest,
  UpdateTandemRequest,
} from '../dtos/tandems/generate-tandems.request';
import {
  ROUTINE_EXECUTION_REPOSITORY,
  RoutineExecutionRepository,
} from 'src/core/ports/routine-execution.repository';
import { KeycloakUser } from '@app/keycloak';

@Controller('tandems')
@Swagger.ApiTags('Tandems')
export class TandemController {
  constructor(
    private readonly generateTandemsUsecase: GenerateTandemsUsecase,
    private readonly getTandemsUsecase: GetTandemsUsecase,
    private readonly createTandemUsecase: CreateTandemUsecase,
    private readonly validateTandemUsecase: ValidateTandemUsecase,
    private readonly refuseTandemUsecase: RefuseTandemUsecase,
    private readonly updateTandemUsecase: UpdateTandemUsecase,
    @Inject(ROUTINE_EXECUTION_REPOSITORY)
    private readonly routineExecutionRepository: RoutineExecutionRepository,
  ) {}

  private async relaunchLastRoutine(user: KeycloakUser) {
    const lastRoutine = await this.routineExecutionRepository.getLast({
      status: RoutineStatus.ENDED,
    });
    if (lastRoutine) {
      await this.generate(user, {
        universityIds: lastRoutine.universities.map(
          (university) => university.id,
        ),
      });
    }
  }

  @Get()
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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

    if (body.relaunch) {
      this.relaunchLastRoutine(user);
    }

    return TandemResponse.fromDomain(tandem);
  }

  @Post(':id/validate')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Validate a Tandem ressource' })
  async validateTandem(
    @CurrentUser() user: KeycloakUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.validateTandemUsecase.execute({
      id,
      adminUniversityId: user.universityId,
    });
  }

  @Post('generate')
  @Roles(Role.ADMIN)
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((err: unknown) => {
        return this.routineExecutionRepository.updateStatus(
          routineExecution.id,
          RoutineStatus.ERROR,
        );
      });

    return null;
  }

  @Post('refuse')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Refuse a tandem' })
  async refuseTandem(
    @CurrentUser() user: KeycloakUser,
    @Body() body: RefuseTandemRequest,
  ): Promise<void> {
    await this.refuseTandemUsecase.execute({
      adminUniversityId: user.universityId,
      learningLanguageIds: body.learningLanguageIds,
    });

    if (body.relaunch) {
      this.relaunchLastRoutine(user);
    }
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a tandem' })
  async updateTandem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateTandemRequest,
  ): Promise<void> {
    await this.updateTandemUsecase.execute({ id, ...request });
  }
}
