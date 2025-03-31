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
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Role, Roles } from '../decorators/roles.decorator';
import { AuthenticationGuard } from '../guards';
import {
  CreateCampusUsecase,
  DeleteCampusUsecase,
  GetCampusByIdUsecase,
  GetCampusUsecase,
  UpdateCampusUsecase,
} from 'src/core/usecases/campus';
import {
  CampusResponse,
  CreateCampusRequest,
  UpdateCampusRequest,
} from 'src/api/dtos/campus';
@Controller('campus')
@Swagger.ApiTags('Campus')
export class CampusController {
  constructor(
    private readonly getCampusUsecase: GetCampusUsecase,
    private readonly getCampusByIdUsecase: GetCampusByIdUsecase,
    private readonly createCampusUsecase: CreateCampusUsecase,
    private readonly updateCampusUsecase: UpdateCampusUsecase,
    private readonly deleteCampusUsecase: DeleteCampusUsecase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Campus ressource.' })
  @Swagger.ApiCreatedResponse({ type: CampusResponse })
  async create(@Body() body: CreateCampusRequest) {
    const campus = await this.createCampusUsecase.execute(body);

    return CampusResponse.fromCampus(campus);
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Get a Campus ressource.' })
  @Swagger.ApiOkResponse({ type: CampusResponse, isArray: true })
  async findCampusById(@Param('id', ParseUUIDPipe) id: string) {
    const campus = await this.getCampusByIdUsecase.execute({ id });

    return CampusResponse.fromCampus(campus);
  }

  @Get()
  @Swagger.ApiOperation({ summary: 'Collection of Campus ressource.' })
  @Swagger.ApiOkResponse({ type: CampusResponse, isArray: true })
  async findCampus() {
    const campus = await this.getCampusUsecase.execute();

    return new Collection<CampusResponse>({
      items: campus.items.map(CampusResponse.fromCampus),
      totalItems: campus.totalItems,
    });
  }

  @Put()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Campus ressource.' })
  @Swagger.ApiOkResponse()
  async update(@Body() request: UpdateCampusRequest) {
    const campus = await this.updateCampusUsecase.execute({
      ...request,
    });

    return CampusResponse.fromCampus(campus);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete a Campus ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id') id: string) {
    return this.deleteCampusUsecase.execute({ id });
  }
}
