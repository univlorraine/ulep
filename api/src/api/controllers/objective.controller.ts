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
import {
  CreateObjectiveUsecase,
  DeleteObjectiveUsecase,
  FindAllObjectiveUsecase,
  FindCustomLearningGoalsUsecase,
  FindOneObjectiveUsecase,
  UpdateObjectiveUsecase,
} from '../../core/usecases/objective';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  CreateObjectiveRequest,
  CustomLearningGoalResponse,
  GetObjectiveResponse,
  ObjectiveResponse,
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
    private readonly findCustomLearningGoalsUsecase: FindCustomLearningGoalsUsecase,
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

  @Get('custom-learning-goals/:learningLanguageId')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Custom learning goals for a specific learning language.',
  })
  @Swagger.ApiOkResponse({ type: CustomLearningGoalResponse, isArray: true })
  async findCustomLearningGoals(
    @Param('learningLanguageId', ParseUUIDPipe) learningLanguageId: string,
  ) {
    const learningGoals =
      await this.findCustomLearningGoalsUsecase.execute(learningLanguageId);
    return learningGoals.map(CustomLearningGoalResponse.fromDomain);
  }
}
