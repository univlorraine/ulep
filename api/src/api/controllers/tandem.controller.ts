/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { Collection } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
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
import { RoutineStatus } from 'src/core/models/routine-execution.model';
import {
  RoutineExecutionRepository,
  ROUTINE_EXECUTION_REPOSITORY,
} from 'src/core/ports/routine-execution.repository';
import {
  CreateTandemUsecase,
  GenerateTandemsUsecase,
  GetTandemsUsecase,
  RefuseTandemUsecase,
  UpdateTandemUsecase,
  ValidateTandemUsecase,
} from 'src/core/usecases/tandem';
import { CollectionResponse, CurrentUser } from '../decorators';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  CreateTandemRequest,
  PaginationDto,
  RefuseTandemRequest,
  TandemResponse,
} from '../dtos';
import {
  GenerateTandemsRequest,
  UpdateTandemRequest,
} from '../dtos/tandems/generate-tandems.request';
import { AuthenticationGuard } from '../guards';

@Controller('tandems')
@Swagger.ApiTags('Tandems')
export class TandemController {
  private readonly logger = new Logger(TandemController.name);

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
      .catch((err: unknown) => {
        this.logger.error(err);
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
