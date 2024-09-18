import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import {
  ActivityResponse,
  ActivityThemeCategoryResponse,
  CreateActivityRequest,
  CreateActivityThemeCategoryRequest,
  UpdateActivityThemeCategoryRequest,
} from 'src/api/dtos/activity';
import { AuthenticationGuard } from 'src/api/guards';
import {
  CreateActivityThemeCategoryUsecase,
  CreateActivityUsecase,
  DeleteActivityThemeCategoryUsecase,
  GetActivityUsecase,
  GetAllActivityThemesUsecase,
  UpdateActivityThemeCategoryUsecase,
  UploadImageActivityUsecase,
  UploadMediaActivityUsecase,
} from 'src/core/usecases';

@Controller('activity')
@Swagger.ApiTags('Activity')
export class ActivityController {
  constructor(
    private readonly createActivityUsecase: CreateActivityUsecase,
    private readonly createActivityThemeCategoryUsecase: CreateActivityThemeCategoryUsecase,
    private readonly getActivityUsecase: GetActivityUsecase,
    private readonly getAllActivityThemesUsecase: GetAllActivityThemesUsecase,
    private readonly updateActivityThemeCategoryUsecase: UpdateActivityThemeCategoryUsecase,
    private readonly deleteActivityThemeCategoryUsecase: DeleteActivityThemeCategoryUsecase,
    private readonly uploadImageActivityUsecase: UploadImageActivityUsecase,
    private readonly uploadMediaActivityUsecase: UploadMediaActivityUsecase,
  ) {}

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
      image?: Express.Multer.File[];
      ressource?: Express.Multer.File[];
      vocabulary?: Express.Multer.File[];
    },
  ) {
    const vocabulariesWithFiles = body.vocabularies.map((vocabulary) => ({
      content: vocabulary,
      pronunciation: files.vocabulary.find((file) =>
        file.originalname.toLowerCase().includes(vocabulary.toLowerCase()),
      ),
    }));

    const activity = await this.createActivityUsecase.execute({
      ...body,
      vocabularies: vocabulariesWithFiles,
    });

    if (files.image && files.image[0]) {
      const imageUrl = await this.uploadImageActivityUsecase.execute({
        activityId: activity.id,
        file: files.image[0],
      });

      activity.imageUrl = imageUrl;
    }

    if (files.ressource && files.ressource[0]) {
      const ressourceFileUrl = await this.uploadMediaActivityUsecase.execute({
        activityId: activity.id,
        file: files.ressource[0],
      });

      activity.ressourceFileUrl = ressourceFileUrl;
    }

    return ActivityResponse.from(activity);
  }

  @Post('category')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Activity theme category.' })
  @Swagger.ApiCreatedResponse({ type: () => ActivityThemeCategoryResponse })
  async createActivityCategory(
    @Body() body: CreateActivityThemeCategoryRequest,
  ) {
    const activityThemeCategory =
      await this.createActivityThemeCategoryUsecase.execute(body);

    return ActivityThemeCategoryResponse.from(activityThemeCategory);
  }

  @Put('category/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Activity theme category.' })
  @Swagger.ApiCreatedResponse({ type: () => ActivityThemeCategoryResponse })
  async updateActivityCategory(
    @Param('id') id: string,
    @Body() body: UpdateActivityThemeCategoryRequest,
  ) {
    const activityThemeCategory =
      await this.updateActivityThemeCategoryUsecase.execute({
        id,
        ...body,
      });

    return ActivityThemeCategoryResponse.from(activityThemeCategory);
  }

  @Delete('category/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete a Activity theme category.' })
  async deleteActivityCategory(@Param('id') id: string) {
    await this.deleteActivityThemeCategoryUsecase.execute(id);
  }

  @Get('category')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get all Activity themes.' })
  @Swagger.ApiOkResponse({ type: () => ActivityThemeCategoryResponse })
  async getActivityThemes(@Headers('Language-code') languageCode?: string) {
    const activityThemes = await this.getAllActivityThemesUsecase.execute();

    return activityThemes.map((activityTheme) =>
      ActivityThemeCategoryResponse.from(activityTheme, languageCode),
    );
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get a Activity ressource.' })
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async getActivity(@Param('id') id: string) {
    const activity = await this.getActivityUsecase.execute(id);

    return ActivityResponse.from(activity);
  }

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
