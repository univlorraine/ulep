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
