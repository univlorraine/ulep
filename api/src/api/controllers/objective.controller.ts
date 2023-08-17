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
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { ObjectiveResponse, CreateObjectiveRequest } from '../dtos/objective';
import {
  CreateObjectiveUsecase,
  DeleteObjectiveUsecase,
  FindAllObjectiveUsecase,
  FindOneObjectiveUsecase,
} from '../../core/usecases/objective';
import { AuthenticationGuard } from '../guards';
import { Roles } from '../decorators/roles.decorator';
import { configuration } from 'src/configuration';
import { ImagesFilePipe } from 'src/api/validators';
import { UploadObjectiveImageUsecase } from 'src/core/usecases/media/upload-objective-image.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import { TranslationsJsonPipe } from 'src/api/pipes/TranslationsJsonPipe';
import { Translation } from 'src/core/models';

@Controller('objectives')
@Swagger.ApiTags('Objectives')
export class ObjectiveController {
  private readonly logger = new Logger(ObjectiveController.name);

  constructor(
    private readonly createObjectiveUsecase: CreateObjectiveUsecase,
    private readonly findAllObjectiveUsecase: FindAllObjectiveUsecase,
    private readonly findOneObjectiveUsecase: FindOneObjectiveUsecase,
    private readonly deleteObjectiveUsecase: DeleteObjectiveUsecase,
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
    @Body('translations', new TranslationsJsonPipe())
    translations: Translation[],
    @UploadedFile(new ImagesFilePipe()) file: Express.Multer.File,
  ) {
    const languageCode = configuration().defaultTranslationLanguage;
    let objective = await this.createObjectiveUsecase.execute({
      ...body,
      translations,
      file,
      languageCode,
    });

    if (file) {
      const upload = await this.uploadObjectiveImageUsecase.execute({
        id: objective.id,
        file,
      });

      console.log(file, upload);

      objective = { ...objective, image: upload };
    }

    return ObjectiveResponse.fromDomain(objective);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Collection of Objective ressource.' })
  @Swagger.ApiOkResponse({ type: ObjectiveResponse, isArray: true })
  async findAll() {
    const instances = await this.findAllObjectiveUsecase.execute();

    return instances.map(ObjectiveResponse.fromDomain);
  }

  @Get(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Objective ressource.' })
  @Swagger.ApiOkResponse({ type: ObjectiveResponse })
  async findOne(@Param('id') id: string) {
    const instance = await this.findOneObjectiveUsecase.execute(id);

    return ObjectiveResponse.fromDomain(instance);
  }

  @Delete(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Deletes a Objective ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id') id: string) {
    return this.deleteObjectiveUsecase.execute({ id });
  }
}
