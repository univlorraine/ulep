import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Headers,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import {
  ObjectiveResponse,
  CreateObjectiveRequest,
  GetObjectiveResponse,
  UpdateObjectiveRequest,
} from '../dtos/objective';
import {
  CreateObjectiveUsecase,
  DeleteObjectiveUsecase,
  FindAllObjectiveUsecase,
  FindOneObjectiveUsecase,
  UpdateObjectiveUsecase,
} from '../../core/usecases/objective';
import { AuthenticationGuard } from '../guards';
import { Roles } from '../decorators/roles.decorator';
import { configuration } from 'src/configuration';
import { ImagesFilePipe } from 'src/api/validators';
import { FileInterceptor } from '@nestjs/platform-express';
import { Collection } from '@app/common';
import {
  DeleteObjectiveImageUsecase,
  UploadObjectiveImageUsecase,
} from 'src/core/usecases/media';

@Controller('objectives')
@Swagger.ApiTags('Objectives')
export class ObjectiveController {
  private readonly logger = new Logger(ObjectiveController.name);

  constructor(
    private readonly createObjectiveUsecase: CreateObjectiveUsecase,
    private readonly deleteObjectiveImageUsecase: DeleteObjectiveImageUsecase,
    private readonly findAllObjectiveUsecase: FindAllObjectiveUsecase,
    private readonly findOneObjectiveUsecase: FindOneObjectiveUsecase,
    private readonly deleteObjectiveUsecase: DeleteObjectiveUsecase,
    private readonly updateObjectiveUsecase: UpdateObjectiveUsecase,
    private readonly uploadObjectiveImageUsecase: UploadObjectiveImageUsecase,
  ) {}

  @Post()
  @Roles(configuration().adminRole)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Objective ressource.' })
  @Swagger.ApiCreatedResponse({ type: ObjectiveResponse })
  async create(
    @Body() body: CreateObjectiveRequest,
    @UploadedFile(new ImagesFilePipe()) file: Express.Multer.File,
  ) {
    const languageCode = configuration().defaultTranslationLanguage;
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
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Objective ressource.' })
  @Swagger.ApiOkResponse({ type: GetObjectiveResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const instance = await this.findOneObjectiveUsecase.execute(id);

    return GetObjectiveResponse.fromDomain(instance);
  }

  @Delete(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Objective ressource.' })
  @Swagger.ApiOkResponse()
  async remove(@Param('id') id: string) {
    await this.deleteObjectiveImageUsecase.execute({ id });

    return this.deleteObjectiveUsecase.execute({ id });
  }

  @Put()
  @Roles(configuration().adminRole)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a new Objective ressource.' })
  @Swagger.ApiCreatedResponse({ type: ObjectiveResponse })
  async update(
    @Body() body: UpdateObjectiveRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ) {
    const languageCode = configuration().defaultTranslationLanguage;
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
}
