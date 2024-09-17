import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { ActivityResponse, CreateActivityRequest } from 'src/api/dtos/activity';
import { AuthenticationGuard } from 'src/api/guards';
import { CreateActivityUsecase } from 'src/core/usecases';

@Controller('activity')
@Swagger.ApiTags('Activity')
export class ActivityController {
  constructor(private readonly createActivityUsecase: CreateActivityUsecase) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'ressource', maxCount: 1 },
      { name: 'vocabulary' },
    ]),
  )
  @Swagger.ApiOperation({ summary: 'Create a new Activity ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiCreatedResponse({ type: () => ActivityResponse })
  async createActivity(
    @Body() body: CreateActivityRequest,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File;
      ressource?: Express.Multer.File;
      vocabulary?: Express.Multer.File;
    },
  ) {
    const activity = await this.createActivityUsecase.execute({
      ...body,
      vocabularies: body.vocabularies.map((vocabulary, index) => ({
        content: vocabulary.content,
        pronunciation: files?.vocabulary[index],
      })),
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get a Activity ressource.' })
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async getActivity(@Param('id') id: string) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get all public Activity ressources.' })
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async getPublicActivities() {}

  @Get('admin')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get all Activity ressources.' })
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async getAllSharedActivitiesToAdmin() {}

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete a Activity ressource.' })
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async deleteActivity() {}

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Activity ressource.' })
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async updateActivity() {}
}
