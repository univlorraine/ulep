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
  Param,
  Post,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Role, Roles } from 'src/api/decorators/roles.decorator';
import { FindAllLanguageParams } from 'src/api/dtos/language-code/language-filters';
import { FindAllSuggestedLanguageParams } from 'src/api/dtos/language-code/suggested-language-filters';
import {
  AddLanguageRequestUsecase,
  FindAllLanguageCodeUsecase,
  GetLanguageUsecase,
  UpdateLanguageCodeUsecase,
} from 'src/core/usecases/language';
import { CountAllSuggestedLanguageUsecase } from 'src/core/usecases/language/count-all-suggested-language.usecase';
import { FindAllSuggestedLanguageUsecase } from 'src/core/usecases/language/find-all-suggested-language.usecase';
import { CollectionResponse, CurrentUser } from '../decorators';
import {
  AllSuggestedLanguageCountResponse,
  LanguageRequestsCountResponse,
  LanguageResponse,
  PaginationDto,
  SuggestedLanguageResponse,
  UpdateLanguageCodeRequest,
} from '../dtos';
import { AuthenticationGuard } from '../guards';

@Controller('languages')
@Swagger.ApiTags('Languages')
export class LanguageController {
  constructor(
    private readonly countAllSuggestedLanguageUsecase: CountAllSuggestedLanguageUsecase,
    private readonly findAllLanguagesUsecase: FindAllLanguageCodeUsecase,
    private readonly findAllSuggestedLanguageUsecase: FindAllSuggestedLanguageUsecase,
    private readonly addLanguageRequestUsecase: AddLanguageRequestUsecase,
    private readonly updateLangaugeUsecase: UpdateLanguageCodeUsecase,
    private readonly getLanguageUsecase: GetLanguageUsecase,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @CollectionResponse(LanguageResponse)
  @Swagger.ApiOperation({ summary: 'Collection of LanguageCode ressource.' })
  @Swagger.ApiOkResponse({ type: LanguageResponse, isArray: true })
  async findAll(
    @Query()
    {
      pagination,
      limit,
      page,
      status,
      order,
      field,
      code,
      name,
    }: FindAllLanguageParams,
  ) {
    const languages = await this.findAllLanguagesUsecase.execute({
      pagination,
      limit,
      page,
      status,
      orderBy: {
        field,
        order,
      },
      filters: {
        code,
        name,
      },
    });

    return new Collection<LanguageResponse>({
      items: languages.items.map((language) =>
        LanguageResponse.fromLanguage(language),
      ),
      totalItems: languages.totalItems,
    });
  }

  @Put()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @CollectionResponse(LanguageResponse)
  @SerializeOptions({ groups: ['read', 'language:read'] })
  @Swagger.ApiOperation({ summary: 'Update LanguageCode ressource.' })
  @Swagger.ApiOkResponse({ type: LanguageResponse, isArray: true })
  async update(
    @Body()
    command: UpdateLanguageCodeRequest,
  ) {
    const language = await this.updateLangaugeUsecase.execute(command);

    return LanguageResponse.fromLanguage(language);
  }

  @Get('requests')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @CollectionResponse(SuggestedLanguageResponse)
  @Swagger.ApiOperation({
    summary: 'Collection of Suggested languages ressource.',
  })
  @Swagger.ApiOkResponse({ type: SuggestedLanguageResponse, isArray: true })
  async findAllRequests(
    @Query() { field, limit, order, page }: FindAllSuggestedLanguageParams,
  ) {
    const suggestedLanguages =
      await this.findAllSuggestedLanguageUsecase.execute({
        orderBy: { order, field },
        limit,
        page,
      });

    return new Collection<SuggestedLanguageResponse>({
      items: suggestedLanguages.items.map(SuggestedLanguageResponse.fromDomain),
      totalItems: suggestedLanguages.totalItems,
    });
  }

  @Get('requests/count')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @CollectionResponse(AllSuggestedLanguageCountResponse)
  @Swagger.ApiOperation({
    summary: 'Collection of Suggested languages by number ressource.',
  })
  @Swagger.ApiOkResponse({
    type: AllSuggestedLanguageCountResponse,
    isArray: true,
  })
  async countAllSuggestedLanguages(@Query() { limit, page }: PaginationDto) {
    const countSuggestedLanguages =
      await this.countAllSuggestedLanguageUsecase.execute({
        limit,
        page,
      });

    return new Collection<AllSuggestedLanguageCountResponse>({
      items: countSuggestedLanguages.items.map(
        AllSuggestedLanguageCountResponse.fromDomain,
      ),
      totalItems: countSuggestedLanguages.totalItems,
    });
  }

  @Post(':code/requests')
  @SerializeOptions({ groups: ['read'] })
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Add new requests .' })
  @Swagger.ApiCreatedResponse({ type: LanguageRequestsCountResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async addRequest(
    @Param('code') code: string,
    @CurrentUser() user: KeycloakUser,
  ): Promise<LanguageRequestsCountResponse> {
    const count = await this.addLanguageRequestUsecase.execute({
      code,
      userId: user.sub,
    });

    return LanguageRequestsCountResponse.fromDomain(count);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @CollectionResponse(LanguageResponse)
  @Swagger.ApiOperation({ summary: 'Get Language ressource.' })
  @Swagger.ApiOkResponse({ type: LanguageResponse })
  async findOne(@Param('id') id: string) {
    const language = await this.getLanguageUsecase.execute({ id });

    return LanguageResponse.fromLanguage(language);
  }
}
