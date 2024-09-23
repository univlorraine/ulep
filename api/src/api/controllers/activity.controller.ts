import { Collection } from '@app/common';
import { KeycloakUser } from '@app/keycloak';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { CurrentUser } from 'src/api/decorators';
import {
  ActivityResponse,
  ActivityThemeCategoryResponse,
  ActivityThemeResponse,
  CreateActivityRequest,
  CreateActivityThemeCategoryRequest,
  CreateActivityThemeRequest,
  GetActivitiesRequest,
  UpdateActivityThemeCategoryRequest,
  UpdateActivityThemeRequest,
} from 'src/api/dtos/activity';
import { AuthenticationGuard } from 'src/api/guards';
import { ActivityStatus } from 'src/core/models/activity.model';
import {
  CreateActivityThemeCategoryUsecase,
  CreateActivityThemeUsecase,
  CreateActivityUsecase,
  DeleteActivityThemeCategoryUsecase,
  DeleteActivityThemeUsecase,
  DeleteActivityUsecase,
  GetActivitiesUsecase,
  GetActivityUsecase,
  GetAllActivityThemesUsecase,
  UpdateActivityThemeCategoryUsecase,
  UpdateActivityThemeUsecase,
  UploadImageActivityUsecase,
  UploadMediaActivityUsecase,
} from 'src/core/usecases';

@Controller('activity')
@Swagger.ApiTags('Activity')
export class ActivityController {
  constructor(
    private readonly createActivityUsecase: CreateActivityUsecase,
    private readonly createActivityThemeCategoryUsecase: CreateActivityThemeCategoryUsecase,
    private readonly createActivityThemeUsecase: CreateActivityThemeUsecase,
    private readonly getActivityUsecase: GetActivityUsecase,
    private readonly getActivitiesUsecase: GetActivitiesUsecase,
    private readonly getAllActivityThemesUsecase: GetAllActivityThemesUsecase,
    private readonly updateActivityThemeCategoryUsecase: UpdateActivityThemeCategoryUsecase,
    private readonly updateActivityThemeUsecase: UpdateActivityThemeUsecase,
    private readonly deleteActivityThemeCategoryUsecase: DeleteActivityThemeCategoryUsecase,
    private readonly deleteActivityThemeUsecase: DeleteActivityThemeUsecase,
    private readonly deleteActivityUsecase: DeleteActivityUsecase,
    private readonly uploadImageActivityUsecase: UploadImageActivityUsecase,
    private readonly uploadMediaActivityUsecase: UploadMediaActivityUsecase,
  ) {}

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
    const vocabulariesWithFiles = body.vocabularies.map((vocabulary) => ({
      content: vocabulary,
      pronunciation: files?.find(
        (file) =>
          file.originalname.toLowerCase().includes(vocabulary.toLowerCase()) &&
          file.fieldname === 'vocabulariesFiles',
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

  @Post('theme')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Create a new Activity theme.' })
  @Swagger.ApiCreatedResponse({ type: () => ActivityThemeCategoryResponse })
  async createActivityTheme(@Body() body: CreateActivityThemeRequest) {
    const activityTheme = await this.createActivityThemeUsecase.execute(body);

    return ActivityThemeResponse.from(activityTheme);
  }

  @Put('theme/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Activity theme.' })
  @Swagger.ApiCreatedResponse({ type: () => ActivityThemeCategoryResponse })
  async updateActivityTheme(
    @Param('id') id: string,
    @Body() body: UpdateActivityThemeRequest,
  ) {
    const activityTheme = await this.updateActivityThemeUsecase.execute({
      id,
      ...body,
    });

    return ActivityThemeResponse.from(activityTheme);
  }

  @Delete('theme/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete a Activity theme.' })
  async deleteActivityTheme(@Param('id') id: string) {
    await this.deleteActivityThemeUsecase.execute(id);
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
      themesIds: query.themesIds,
      languageLevels: query.languageLevels,
      languagesCodes: query.languagesCodes,
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
  async getAllSharedActivitiesToAdmin() {}

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
  async updateActivity() {}
}
