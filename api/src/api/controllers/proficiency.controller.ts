import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  SerializeOptions,
  ParseUUIDPipe,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  CreateQuestionRequest,
  CreateTestRequest,
  ProficiencyQuestionResponse,
  ProficiencyTestResponse,
} from '../dtos';
import {
  CreateQuestionUsecase,
  CreateTestUsecase,
  DeleteQuestionUsecase,
  DeleteTestUsecase,
  GetLevelsUsecase,
  GetQuestionsByLevelUsecase,
  GetQuestionsUsecase,
  GetTestUsecase,
  GetTestsUsecase,
} from 'src/core/usecases/proficiency';
import { ParseProficiencyLevelPipe } from '../validators';
import { ProficiencyLevel } from 'src/core/models';
import { AuthenticationGuard } from '../guards';
import { Roles } from '../decorators/roles.decorator';
import { configuration } from 'src/configuration';
import { GetProficiencyQueryParams } from 'src/api/dtos/proficiency/proficiency-filters';
import { Collection } from '@app/common';

@Controller('proficiency')
@Swagger.ApiTags('Proficiency')
export class ProficiencyController {
  private readonly logger = new Logger(ProficiencyController.name);

  constructor(
    private readonly createTestUsecase: CreateTestUsecase,
    private readonly getTestsUsecase: GetTestsUsecase,
    private readonly getTestUsecase: GetTestUsecase,
    private readonly getQuestionsUsecase: GetQuestionsUsecase,
    private readonly getQuestionsByLevelUsecase: GetQuestionsByLevelUsecase,
    private readonly deleteTestUsecase: DeleteTestUsecase,
    private readonly createQuestionUsecase: CreateQuestionUsecase,
    private readonly deleteQuestionUsecase: DeleteQuestionUsecase,
    private readonly getLevelsUsecase: GetLevelsUsecase,
  ) {}

  @Post('tests')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Test ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProficiencyTestResponse })
  async create(@Body() body: CreateTestRequest) {
    const instance = await this.createTestUsecase.execute(body);

    return ProficiencyTestResponse.fromProficiencyTest(instance);
  }

  @Get('tests')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Test ressource.' })
  @Swagger.ApiOkResponse({ type: ProficiencyTestResponse, isArray: true })
  async findAll(@Headers('Language-code') languageCode?: string) {
    const instances = await this.getTestsUsecase.execute();
    const code =
      configuration().defaultTranslationLanguage !== languageCode
        ? languageCode
        : undefined;
    return new Collection<ProficiencyTestResponse>({
      items: instances.map((instance) =>
        ProficiencyTestResponse.fromProficiencyTest(instance, code),
      ),
      totalItems: instances.length,
    });
  }

  @Get('tests/:id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read', 'test:read'] })
  @Swagger.ApiOperation({ summary: 'Test ressource.' })
  @Swagger.ApiOkResponse({ type: ProficiencyTestResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.getTestUsecase.execute({ id });

    return ProficiencyTestResponse.fromProficiencyTest(instance);
  }

  @Delete('tests/:id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Test ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteTestUsecase.execute({ id });
  }

  @Get('questions/:level')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Question ressource.' })
  @Swagger.ApiParam({ name: 'level', enum: ProficiencyLevel })
  @Swagger.ApiOkResponse({ type: ProficiencyQuestionResponse, isArray: true })
  async findQuestionsByLevel(
    @Param('level', ParseProficiencyLevelPipe) level: ProficiencyLevel,
  ) {
    const instances = await this.getQuestionsByLevelUsecase.execute({ level });

    return instances.map((proficiency) =>
      ProficiencyQuestionResponse.fromProficiencyQuestion(proficiency),
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
    const code =
      configuration().defaultTranslationLanguage !== languageCode
        ? languageCode
        : undefined;
    const instances = await this.getQuestionsUsecase.execute({
      limit,
      page,
      where: level,
    });

    return new Collection<ProficiencyQuestionResponse>({
      items: instances.items.map((question) =>
        ProficiencyQuestionResponse.fromProficiencyQuestion(question, code),
      ),
      totalItems: instances.totalItems,
    });
  }

  @Post('questions')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Question ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProficiencyQuestionResponse })
  async createQuestion(@Body() body: CreateQuestionRequest) {
    const instance = await this.createQuestionUsecase.execute(body);

    return ProficiencyQuestionResponse.fromProficiencyQuestion(instance);
  }

  @Delete('questions/:id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Question ressource.' })
  @Swagger.ApiOkResponse()
  removeQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteQuestionUsecase.execute({ id });
  }

  @Get('levels')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Proficiency Levels.' })
  @Swagger.ApiOkResponse({ type: String, isArray: true })
  async levels() {
    const levels = this.getLevelsUsecase.execute();

    return levels;
  }
}
