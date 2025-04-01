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

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  ParseUUIDPipe,
  SerializeOptions,
  UseGuards,
  Query,
  Headers,
  Put,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  InterestResponse,
  CreateInterestRequest,
  InterestCategoryResponse,
  CreateInterestCategoryRequest,
  GetInterestResponse,
  UpdateInterestRequest,
  GetInterestCategoryResponse,
} from '../dtos/interests';
import {
  CreateInterestCategoryUsecase,
  CreateInterestUsecase,
  DeleteInterestCategoryUsecase,
  DeleteInterestUsecase,
  GetInterestCategoryUsecase,
  GetInterestUsecase,
  GetInterestsByCategoriesUsecase,
  UpdateInterestCategoryUsecase,
  UpdateInterestUsecase,
} from '../../core/usecases/interest';
import { AuthenticationGuard } from '../guards';
import { Role, Roles } from '../decorators/roles.decorator';
import { GetInterestsQueryParams } from 'src/api/dtos/interests/interests-filter';
import { Collection } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';

@Controller('interests')
@Swagger.ApiTags('Interests')
export class InterestController {
  private readonly logger = new Logger(InterestController.name);

  private readonly defaultLanguageCode: string;

  constructor(
    private readonly createInterestUsecase: CreateInterestUsecase,
    private readonly createCategoryUsecase: CreateInterestCategoryUsecase,
    private readonly getInterest: GetInterestUsecase,
    private readonly getInterestCategory: GetInterestCategoryUsecase,
    private readonly getInterestsByCategoriesUsecase: GetInterestsByCategoriesUsecase,
    private readonly deleteCategoryUsecase: DeleteInterestCategoryUsecase,
    private readonly deleteInterestUsecase: DeleteInterestUsecase,
    private readonly updateInterestUsecase: UpdateInterestUsecase,
    private readonly updateIterestCategoryUsecase: UpdateInterestCategoryUsecase,
    env: ConfigService<Env, true>,
  ) {
    this.defaultLanguageCode = env.get<string>('DEFAULT_TRANSLATION_LANGUAGE');
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Interest ressource.' })
  @Swagger.ApiCreatedResponse({ type: InterestResponse })
  async createInterest(@Body() body: CreateInterestRequest) {
    const instance = await this.createInterestUsecase.execute({
      ...body,
      languageCode: this.defaultLanguageCode,
    });

    return InterestResponse.fromDomain(instance);
  }

  @Post('categories')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Category ressource.' })
  @Swagger.ApiCreatedResponse({ type: InterestResponse })
  async createCategory(@Body() body: CreateInterestCategoryRequest) {
    const instance = await this.createCategoryUsecase.execute({
      ...body,
      languageCode: this.defaultLanguageCode,
    });

    return InterestCategoryResponse.fromDomain(instance);
  }

  @Get('categories')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'category:read'] })
  @Swagger.ApiOperation({ summary: 'Collection of Interest ressource.' })
  @Swagger.ApiOkResponse({ type: InterestCategoryResponse, isArray: true })
  async findAll(
    @Query() { limit, order, page }: GetInterestsQueryParams,
    @Headers('Language-code') languageCode?: string,
  ) {
    const categories = await this.getInterestsByCategoriesUsecase.execute({
      limit,
      order,
      page,
    });

    return new Collection<InterestCategoryResponse>({
      items: categories.items.map((category) =>
        InterestCategoryResponse.fromDomain(category, languageCode),
      ),
      totalItems: categories.totalItems,
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'category:read'] })
  @Swagger.ApiOperation({ summary: 'Get Interest ressource.' })
  @Swagger.ApiOkResponse({ type: GetInterestResponse, isArray: true })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const interest = await this.getInterest.execute({ id });

    return GetInterestResponse.fromDomain(interest);
  }

  @Get('categories/:id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'category:read'] })
  @Swagger.ApiOperation({ summary: 'Get Category ressource.' })
  @Swagger.ApiOkResponse({ type: GetInterestCategoryResponse, isArray: true })
  async findOnecategory(@Param('id', ParseUUIDPipe) id: string) {
    const interest = await this.getInterestCategory.execute({ id });

    return GetInterestCategoryResponse.fromDomain(interest);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Interest ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteInterestUsecase.execute({ id });
  }

  @Delete('categories/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Category ressource.' })
  @Swagger.ApiOkResponse()
  removeCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteCategoryUsecase.execute({ id });
  }

  @Put()
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update an Interest ressource.' })
  @Swagger.ApiOkResponse({ type: InterestResponse })
  async updateInterest(@Body() body: UpdateInterestRequest) {
    const interest = await this.updateInterestUsecase.execute(body);

    return InterestResponse.fromDomain(interest);
  }

  @Put('categories')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update an Category ressource.' })
  @Swagger.ApiOkResponse({ type: InterestCategoryResponse })
  async updateInterestCategory(@Body() body: UpdateInterestRequest) {
    const categorie = await this.updateIterestCategoryUsecase.execute(body);

    return InterestCategoryResponse.fromDomain(categorie);
  }
}
