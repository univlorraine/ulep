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
  GetTestUsecase,
  GetTestsUsecase,
} from 'src/core/usecases/proficiency';
import { ParseProficiencyLevelPipe } from '../validators';
import { ProficiencyLevel } from 'src/core/models';

@Controller('proficiency')
@Swagger.ApiTags('Proficiency')
export class ProficiencyController {
  private readonly logger = new Logger(ProficiencyController.name);

  constructor(
    private readonly createTestUsecase: CreateTestUsecase,
    private readonly getTestsUsecase: GetTestsUsecase,
    private readonly getTestUsecase: GetTestUsecase,
    private readonly getQuestionsByLevelUsecase: GetQuestionsByLevelUsecase,
    private readonly deleteTestUsecase: DeleteTestUsecase,
    private readonly createQuestionUsecase: CreateQuestionUsecase,
    private readonly deleteQuestionUsecase: DeleteQuestionUsecase,
    private readonly getLevelsUsecase: GetLevelsUsecase,
  ) {}

  // TODO: only admin can create a test
  @Post('tests')
  @Swagger.ApiOperation({ summary: 'Create a new Test ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProficiencyTestResponse })
  async create(@Body() body: CreateTestRequest) {
    const instance = await this.createTestUsecase.execute(body);

    return ProficiencyTestResponse.fromProficiencyTest(instance);
  }

  // TODO: only connected users can access this route
  @Get('tests')
  @Swagger.ApiOperation({ summary: 'Collection of Test ressource.' })
  @Swagger.ApiOkResponse({ type: ProficiencyTestResponse, isArray: true })
  async findAll() {
    const instances = await this.getTestsUsecase.execute();

    return instances.map(ProficiencyTestResponse.fromProficiencyTest);
  }

  // TODO: only connected users can access this route
  @Get('tests/:id')
  @SerializeOptions({ groups: ['read', 'test:read'] })
  @Swagger.ApiOperation({ summary: 'Test ressource.' })
  @Swagger.ApiOkResponse({ type: ProficiencyTestResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.getTestUsecase.execute({ id });

    return ProficiencyTestResponse.fromProficiencyTest(instance);
  }

  // TODO: only admin can delete a test
  @Delete('tests/:id')
  @Swagger.ApiOperation({ summary: 'Deletes a Test ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteTestUsecase.execute({ id });
  }

  @Get('questions/:level')
  @Swagger.ApiOperation({ summary: 'Collection of Question ressource.' })
  @Swagger.ApiParam({ name: 'level', enum: ProficiencyLevel })
  @Swagger.ApiOkResponse({ type: ProficiencyQuestionResponse, isArray: true })
  async findQuestionsByLevel(
    @Param('level', ParseProficiencyLevelPipe) level: ProficiencyLevel,
  ) {
    const instances = await this.getQuestionsByLevelUsecase.execute({ level });

    return instances.map(ProficiencyQuestionResponse.fromProficiencyQuestion);
  }

  // TODO: only admin can create a question
  @Post('questions')
  @Swagger.ApiOperation({ summary: 'Create a new Question ressource.' })
  @Swagger.ApiCreatedResponse({ type: ProficiencyQuestionResponse })
  async createQuestion(@Body() body: CreateQuestionRequest) {
    const instance = await this.createQuestionUsecase.execute(body);

    return ProficiencyQuestionResponse.fromProficiencyQuestion(instance);
  }

  // TODO: only admin can delete a question
  @Delete('questions/:id')
  @Swagger.ApiOperation({ summary: 'Deletes a Question ressource.' })
  @Swagger.ApiOkResponse()
  removeQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteQuestionUsecase.execute({ id });
  }

  @Get('levels')
  @Swagger.ApiOperation({ summary: 'Proficiency Levels.' })
  @Swagger.ApiOkResponse({ type: String, isArray: true })
  async levels() {
    const levels = this.getLevelsUsecase.execute();

    return levels;
  }
}
