import { Collection } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { ImagesFilePipe } from 'src/api/validators';
import { Env } from 'src/configuration';
import {
  DeleteObjectiveImageUsecase,
  UploadObjectiveImageUsecase,
} from 'src/core/usecases/media';
import { CreateCustomLearningGoalUsecase } from 'src/core/usecases/objective/create-custom-learning-goals.usecase';
import { DeleteCustomLearningGoalUsecase } from 'src/core/usecases/objective/delete-custom-learning-goal.usecase';
import { UpdateCustomLearningGoalUsecase } from 'src/core/usecases/objective/update-custom-learning-goal.usecase';
import {
  CreateObjectiveUsecase,
  DeleteObjectiveUsecase,
  FindAllObjectiveUsecase,
  FindOneObjectiveUsecase,
  UpdateObjectiveUsecase,
} from '../../core/usecases/objective';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  CreateCustomLearningGoalRequest,
  CreateObjectiveRequest,
  CustomLearningGoalResponse,
  GetObjectiveResponse,
  ObjectiveResponse,
  UpdateCustomLearningGoalRequest,
  UpdateObjectiveRequest,
} from '../dtos/objective';
import { AuthenticationGuard } from '../guards';

@Controller('objectives')
@Swagger.ApiTags('Objectives')
export class ObjectiveController {
  #defaultLanguageCode: string;

  constructor(
    private readonly createObjectiveUsecase: CreateObjectiveUsecase,
    private readonly deleteObjectiveImageUsecase: DeleteObjectiveImageUsecase,
    private readonly findAllObjectiveUsecase: FindAllObjectiveUsecase,
    private readonly findOneObjectiveUsecase: FindOneObjectiveUsecase,
    private readonly deleteObjectiveUsecase: DeleteObjectiveUsecase,
    private readonly updateObjectiveUsecase: UpdateObjectiveUsecase,
    private readonly uploadObjectiveImageUsecase: UploadObjectiveImageUsecase,
    private readonly createCustomLearningGoalUsecase: CreateCustomLearningGoalUsecase,
    private readonly updateCustomLearningGoalUsecase: UpdateCustomLearningGoalUsecase,
    private readonly deleteCustomLearningGoalUsecase: DeleteCustomLearningGoalUsecase,
    env: ConfigService<Env, true>,
  ) {
    this.#defaultLanguageCode = env.get<string>('DEFAULT_TRANSLATION_LANGUAGE');
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Objective ressource.' })
  @Swagger.ApiCreatedResponse({ type: ObjectiveResponse })
  async create(
    @Body() body: CreateObjectiveRequest,
    @UploadedFile(new ImagesFilePipe()) file: Express.Multer.File,
  ) {
    const languageCode = this.#defaultLanguageCode;

    let objective = await this.createObjectiveUsecase.execute({
      ...body,
      languageCode,
    });

    if (file) {
      const upload = await this.uploadObjectiveImageUsecase.execute({
        id: objective.id,
        file,
      });

      objective = { ...objective, image: upload };
    }

    return ObjectiveResponse.fromDomain(objective);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Objective ressource.' })
  @Swagger.ApiOkResponse({ type: ObjectiveResponse, isArray: true })
  async findAll(@Headers('Language-code') languageCode?: string) {
    const instances = await this.findAllObjectiveUsecase.execute();
    return new Collection<ObjectiveResponse>({
      items: instances.map((instance) =>
        ObjectiveResponse.fromDomain(instance, languageCode),
      ),
      totalItems: instances.length,
    });
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Objective ressource.' })
  @Swagger.ApiOkResponse({ type: GetObjectiveResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.findOneObjectiveUsecase.execute(id);

    return GetObjectiveResponse.fromDomain(instance);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Objective ressource.' })
  @Swagger.ApiOkResponse()
  async remove(@Param('id') id: string) {
    await this.deleteObjectiveImageUsecase.execute({ id });

    return this.deleteObjectiveUsecase.execute({ id });
  }

  @Put()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a new Objective ressource.' })
  @Swagger.ApiCreatedResponse({ type: ObjectiveResponse })
  async update(
    @Body() body: UpdateObjectiveRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    const languageCode = this.#defaultLanguageCode;

    let objective = await this.updateObjectiveUsecase.execute({
      ...body,
      languageCode,
    });

    if (file) {
      const upload = await this.uploadObjectiveImageUsecase.execute({
        id: objective.id,
        file,
      });

      objective = { ...objective, image: upload };
    }

    return ObjectiveResponse.fromDomain(objective);
  }

  @Post('custom-learning-goals')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  async createCustomLearningGoal(
    @Body() body: CreateCustomLearningGoalRequest,
  ) {
    const customLearningGoals =
      await this.createCustomLearningGoalUsecase.execute(body);

    return customLearningGoals.map(CustomLearningGoalResponse.fromDomain);
  }

  @Put('custom-learning-goals/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  async updateCustomLearningGoal(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCustomLearningGoalRequest,
  ) {
    const customLearningGoals =
      await this.updateCustomLearningGoalUsecase.execute(id, body);

    return customLearningGoals.map(CustomLearningGoalResponse.fromDomain);
  }

  @Delete('custom-learning-goals/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  async deleteCustomLearningGoal(@Param('id', ParseUUIDPipe) id: string) {
    const customLearningGoals =
      await this.deleteCustomLearningGoalUsecase.execute(id);

    return customLearningGoals.map(CustomLearningGoalResponse.fromDomain);
  }
}
