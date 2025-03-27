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
  SerializeOptions,
  ParseUUIDPipe,
  UseGuards,
  Headers,
  Query,
  Put,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  CreateQuestionRequest,
  CreateTestRequest,
  GetProficiencyQuestionResponse,
  ProficiencyQuestionResponse,
  ProficiencyTestResponse,
  UpdateQuestionRequest,
} from '../dtos';
import {
  CreateQuestionUsecase,
  CreateTestUsecase,
  DeleteQuestionUsecase,
  DeleteTestUsecase,
  GetLevelsUsecase,
  GetQuestionUsecase,
  GetQuestionsByLevelUsecase,
  GetQuestionsUsecase,
  GetTestUsecase,
  GetTestsUsecase,
} from 'src/core/usecases/proficiency';
import { ParseProficiencyLevelPipe } from '../validators';
import { ProficiencyLevel } from 'src/core/models';
import { AuthenticationGuard } from '../guards';
import { Role, Roles } from '../decorators/roles.decorator';
import { GetProficiencyQueryParams } from 'src/api/dtos/proficiency/proficiency-filters';
import { Collection } from '@app/common';
import { UpdateQuestionUsecase } from 'src/core/usecases/proficiency/update-question.usecase';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';

@Controller('proficiency')
@Swagger.ApiTags('Proficiency')
export class ProficiencyController {
  #defaultLanguageCode: string;

  constructor(
    private readonly createTestUsecase: CreateTestUsecase,
    private readonly getTestsUsecase: GetTestsUsecase,
    private readonly getTestUsecase: GetTestUsecase,
    private readonly getQuestionUsecase: GetQuestionUsecase,
    private readonly getQuestionsUsecase: GetQuestionsUsecase,
    private readonly getQuestionsByLevelUsecase: GetQuestionsByLevelUsecase,
    private readonly deleteTestUsecase: DeleteTestUsecase,
    private readonly createQuestionUsecase: CreateQuestionUsecase,
    private readonly deleteQuestionUsecase: DeleteQuestionUsecase,
    private readonly getLevelsUsecase: GetLevelsUsecase,
    private readonly updateQuestionUsecase: UpdateQuestionUsecase,
    env: ConfigService<Env, true>,
  ) {
    this.#defaultLanguageCode = env.get<string>('DEFAULT_TRANSLATION_LANGUAGE');
  }

  @Post('tests')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Test ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProficiencyTestResponse })
  async create(@Body() body: CreateTestRequest) {
    const test = await this.createTestUsecase.execute(body);

    return ProficiencyTestResponse.fromProficiencyTest(test);
  }

  @Get('tests')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Test ressource.' })
  @Swagger.ApiOkResponse({ type: ProficiencyTestResponse, isArray: true })
  async findAll(@Headers('Language-code') languageCode?: string) {
    const tests = await this.getTestsUsecase.execute();
    return new Collection<ProficiencyTestResponse>({
      items: tests.map((instance) =>
        ProficiencyTestResponse.fromProficiencyTest(instance, languageCode),
      ),
      totalItems: tests.length,
    });
  }

  @Get('tests/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'test:read'] })
  @Swagger.ApiOperation({ summary: 'Test ressource.' })
  @Swagger.ApiOkResponse({ type: ProficiencyTestResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const test = await this.getTestUsecase.execute({ id });

    return ProficiencyTestResponse.fromProficiencyTest(test);
  }

  @Delete('tests/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Test ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteTestUsecase.execute({ id });
  }

  @Get('questions/level/:level')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Question ressource.' })
  @Swagger.ApiParam({ name: 'level', enum: ProficiencyLevel })
  @Swagger.ApiOkResponse({ type: ProficiencyQuestionResponse, isArray: true })
  async findQuestionsByLevel(
    @Param('level', ParseProficiencyLevelPipe) level: ProficiencyLevel,
    @Headers('Language-code') languageCode?: string,
  ) {
    const questions = await this.getQuestionsByLevelUsecase.execute({ level });

    return questions.map((question) =>
      ProficiencyQuestionResponse.fromProficiencyQuestion(
        question,
        languageCode,
      ),
    );
  }

  @Get('questions')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Question ressource.' })
  @Swagger.ApiOkResponse({ type: ProficiencyQuestionResponse, isArray: true })
  async findQuestions(
    @Query() { limit, page, level }: GetProficiencyQueryParams,
    @Headers('Language-code') languageCode?: string,
  ) {
    const questions = await this.getQuestionsUsecase.execute({
      limit,
      page,
      where: level,
    });

    return new Collection<ProficiencyQuestionResponse>({
      items: questions.items.map((question) =>
        ProficiencyQuestionResponse.fromProficiencyQuestion(
          question,
          languageCode,
        ),
      ),
      totalItems: questions.totalItems,
    });
  }

  @Get('questions/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get a Question ressource.' })
  @Swagger.ApiOkResponse({ type: GetProficiencyQuestionResponse })
  async findQuestion(@Param('id', ParseUUIDPipe) id: string) {
    const question = await this.getQuestionUsecase.execute({ id });

    return GetProficiencyQuestionResponse.fromProficiencyQuestion(question);
  }

  @Post('questions')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Question ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProficiencyQuestionResponse })
  async createQuestion(@Body() body: CreateQuestionRequest) {
    const languageCode = this.#defaultLanguageCode;
    const question = await this.createQuestionUsecase.execute({
      ...body,
      languageCode,
    });

    return ProficiencyQuestionResponse.fromProficiencyQuestion(question);
  }

  @Put('questions')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Question ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProficiencyQuestionResponse })
  async updateQuestion(@Body() body: UpdateQuestionRequest) {
    const languageCode = this.#defaultLanguageCode;
    const question = await this.updateQuestionUsecase.execute({
      ...body,
      languageCode,
    });

    return ProficiencyQuestionResponse.fromProficiencyQuestion(question);
  }

  @Delete('questions/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Question ressource.' })
  @Swagger.ApiOkResponse()
  removeQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteQuestionUsecase.execute({ id });
  }

  @Get('levels')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Proficiency Levels.' })
  @Swagger.ApiOkResponse({ type: String, isArray: true })
  async levels() {
    const levels = this.getLevelsUsecase.execute();

    return levels;
  }
}
