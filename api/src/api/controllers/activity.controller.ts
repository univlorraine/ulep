import { Collection } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { CurrentUser } from 'src/api/decorators';
import {
  ActivityResponse,
  ActivityThemeCategoryResponse,
  CreateActivityRequest,
  CreateActivityThemeCategoryRequest,
  CreateActivityThemeRequest,
  GetActivitiesRequest,
  GetActivityThemeCategoryResponse,
  GetActivityThemeResponse,
  UpdateActivityThemeCategoryRequest,
  UpdateActivityThemeRequest,
} from 'src/api/dtos/activity';
import { AuthenticationGuard } from 'src/api/guards';
import { Env } from 'src/configuration';
import { ActivityStatus } from 'src/core/models/activity.model';
import {
  CreateActivityThemeCategoryUsecase,
  CreateActivityThemeUsecase,
  CreateActivityUsecase,
  DeleteActivityThemeCategoryUsecase,
  DeleteActivityThemeUsecase,
  DeleteActivityUsecase,
  GetActivitiesUsecase,
  GetActivityThemeCategoryUsecase,
  GetActivityThemeUsecase,
  GetActivityUsecase,
  GetAllActivityThemesUsecase,
  UpdateActivityThemeCategoryUsecase,
  UpdateActivityThemeUsecase,
  UploadImageActivityUsecase,
  UploadMediaActivityUsecase,
} from 'src/core/usecases';
import { GetActivitiesCategoriesRequest } from '../dtos/activity/get-activity-categories.request';

@Controller('activities')
@Swagger.ApiTags('Activities')
export class ActivityController {
  logger = new Logger(ActivityController.name);

  private readonly defaultLanguageCode: string;

  constructor(
    private readonly createActivityUsecase: CreateActivityUsecase,
    private readonly getActivityThemeCategoryUsecase: GetActivityThemeCategoryUsecase,
    private readonly createActivityThemeCategoryUsecase: CreateActivityThemeCategoryUsecase,
    private readonly createActivityThemeUsecase: CreateActivityThemeUsecase,
    private readonly getActivityUsecase: GetActivityUsecase,
    private readonly getActivityThemeUsecase: GetActivityThemeUsecase,
    private readonly getActivitiesUsecase: GetActivitiesUsecase,
    private readonly getAllActivityThemesUsecase: GetAllActivityThemesUsecase,
    private readonly updateActivityThemeCategoryUsecase: UpdateActivityThemeCategoryUsecase,
    private readonly updateActivityThemeUsecase: UpdateActivityThemeUsecase,
    private readonly deleteActivityThemeCategoryUsecase: DeleteActivityThemeCategoryUsecase,
    private readonly deleteActivityThemeUsecase: DeleteActivityThemeUsecase,
    private readonly deleteActivityUsecase: DeleteActivityUsecase,
    private readonly uploadImageActivityUsecase: UploadImageActivityUsecase,
    private readonly uploadMediaActivityUsecase: UploadMediaActivityUsecase,
    private readonly env: ConfigService<Env, true>,
  ) {
    this.defaultLanguageCode = env.get<string>('DEFAULT_TRANSLATION_LANGUAGE');
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @Swagger.ApiOperation({ summary: 'Create a new Activity ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiCreatedResponse({ type: () => ActivityResponse })
  async createActivity(
    @Body() body: CreateActivityRequest,
    @UploadedFiles()
    files?: Express.Multer.File[],
  ) {
    //TODO: Add Pipe files validators
    const vocabulariesWithFiles = body.vocabularies.map((vocabulary) => ({
      content: vocabulary,
      pronunciation: files?.find(
        (file) =>
          file.originalname.toLowerCase().includes(vocabulary.toLowerCase()) &&
          file.fieldname.includes('vocabulariesFiles'),
      ),
    }));

    const activity = await this.createActivityUsecase.execute({
      ...body,
      vocabularies: vocabulariesWithFiles,
    });

    const imageFile = files?.find((file) => file.fieldname === 'image');
    const ressourceFile = files?.find((file) => file.fieldname === 'ressource');

    if (imageFile) {
      const imageUrl = await this.uploadImageActivityUsecase.execute({
        activityId: activity.id,
        file: imageFile,
      });

      activity.imageUrl = imageUrl;
    }

    if (ressourceFile) {
      const ressourceFileUrl = await this.uploadMediaActivityUsecase.execute({
        activityId: activity.id,
        file: ressourceFile,
      });

      activity.ressourceFileUrl = ressourceFileUrl;
    }

    return ActivityResponse.from(activity);
  }

  @Post('themes')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Activity theme.' })
  @Swagger.ApiCreatedResponse({ type: () => GetActivityThemeResponse })
  async createActivityTheme(@Body() body: CreateActivityThemeRequest) {
    const activityTheme = await this.createActivityThemeUsecase.execute({
      ...body,
      languageCode: this.defaultLanguageCode,
    });

    return GetActivityThemeResponse.from(activityTheme);
  }

  @Get('themes/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get an Activity theme.' })
  @Swagger.ApiOkResponse({ type: () => GetActivityThemeResponse })
  async getThemeCategory(@Param('id') id: string) {
    const activityTheme = await this.getActivityThemeUsecase.execute(id);

    return GetActivityThemeResponse.from(activityTheme);
  }

  @Put('themes/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Activity theme.' })
  @Swagger.ApiCreatedResponse({ type: () => GetActivityThemeResponse })
  async updateActivityTheme(
    @Param('id') id: string,
    @Body() body: UpdateActivityThemeRequest,
  ) {
    const activityTheme = await this.updateActivityThemeUsecase.execute({
      id,
      ...body,
      languageCode: this.defaultLanguageCode,
    });

    return GetActivityThemeResponse.from(activityTheme);
  }

  @Delete('themes/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete a Activity theme.' })
  async deleteActivityTheme(@Param('id') id: string) {
    await this.deleteActivityThemeUsecase.execute(id);
  }

  @Get('categories/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get an Activity theme category.' })
  @Swagger.ApiOkResponse({ type: () => GetActivityThemeCategoryResponse })
  async getActivityCategory(@Param('id') id: string) {
    const activityThemeCategory =
      await this.getActivityThemeCategoryUsecase.execute(id);

    return GetActivityThemeCategoryResponse.from(activityThemeCategory);
  }

  @Post('categories')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Activity theme category.' })
  @Swagger.ApiCreatedResponse({ type: () => GetActivityThemeCategoryResponse })
  async createActivityCategory(
    @Body() body: CreateActivityThemeCategoryRequest,
  ) {
    const activityThemeCategory =
      await this.createActivityThemeCategoryUsecase.execute({
        ...body,
        languageCode: this.defaultLanguageCode,
      });

    return GetActivityThemeCategoryResponse.from(activityThemeCategory);
  }

  // The "id" is used threw payload instead of path param because of react-admin list cache
  @Put('categories')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update an Activity theme category.' })
  @Swagger.ApiCreatedResponse({ type: () => GetActivityThemeCategoryResponse })
  async updateActivityCategory(
    @Body() body: UpdateActivityThemeCategoryRequest,
  ) {
    const activityThemeCategory =
      await this.updateActivityThemeCategoryUsecase.execute({
        ...body,
        languageCode: this.defaultLanguageCode,
      });

    return GetActivityThemeCategoryResponse.from(activityThemeCategory);
  }

  @Delete('categories/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete a Activity theme category.' })
  async deleteActivityCategory(@Param('id') id: string) {
    await this.deleteActivityThemeCategoryUsecase.execute(id);
  }

  @Get('categories')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Get all Activity themes categories and themes.',
  })
  @Swagger.ApiOkResponse({ type: () => ActivityThemeCategoryResponse })
  async getActivityThemes(
    @Headers('Language-code') languageCode?: string,
    @Query() query?: GetActivitiesCategoriesRequest,
  ) {
    const activityThemes = await this.getAllActivityThemesUsecase.execute({
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });

    return new Collection<ActivityThemeCategoryResponse>({
      items: activityThemes.items.map((activityTheme) =>
        ActivityThemeCategoryResponse.from(activityTheme, languageCode),
      ),
      totalItems: activityThemes.totalItems,
    });
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
  async getPublicActivities(
    @Query() query: GetActivitiesRequest,
    @CurrentUser() user: KeycloakUser,
    @Headers('Language-code') languageCode?: string,
  ) {
    const status = !query.shouldTakeOnlyMine
      ? [ActivityStatus.PUBLISHED]
      : [
          ActivityStatus.PUBLISHED,
          ActivityStatus.IN_VALIDATION,
          ActivityStatus.DRAFT,
        ];

    const activities = await this.getActivitiesUsecase.execute({
      status,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
      searchTitle: query.searchTitle,
      themesIds:
        typeof query.themesIds === 'string' //Because its query params, we need to convert it to an array if its a string when we have only one element on url
          ? [query.themesIds]
          : query.themesIds,
      languageLevels:
        typeof query.languageLevels === 'string' //Because its query params, we need to convert it to an array if its a string when we have only one element on url
          ? [query.languageLevels]
          : query.languageLevels,
      languagesCodes:
        typeof query.languagesCodes === 'string' //Because its query params, we need to convert it to an array if its a string when we have only one element on url
          ? [query.languagesCodes]
          : query.languagesCodes,
      userId: query.shouldTakeOnlyMine ? user.sub : undefined,
    });

    return new Collection<ActivityResponse>({
      items: activities.items.map((activity) =>
        ActivityResponse.from(activity, languageCode),
      ),
      totalItems: activities.totalItems,
    });
  }

  @Get('admin')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get all Activity ressources.' })
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async getAllSharedActivitiesToAdmin() {
    this.logger.log('getAllSharedActivitiesToAdmin');
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete a Activity ressource.' })
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async deleteActivity(@Param('id') id: string) {
    await this.deleteActivityUsecase.execute(id);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Activity ressource.' })
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async updateActivity() {
    this.logger.log('updateActivity');
  }
}
