/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from 'src/api/decorators';
import { Role, Roles } from 'src/api/decorators/roles.decorator';
import {
  ActivityResponse,
  ActivityThemeCategoryResponse,
  CreateActivityRequest,
  CreateActivityThemeCategoryRequest,
  CreateActivityThemeRequest,
  GetActivitiesRequest,
  GetActivityThemeCategoryResponse,
  GetActivityThemeResponse,
  UpdateActivityRequest,
  UpdateActivityStatusRequest,
  UpdateActivityThemeCategoryRequest,
  UpdateActivityThemeRequest,
} from 'src/api/dtos/activity';
import { AuthenticationGuard } from 'src/api/guards';
import { Env } from 'src/configuration';
import {
  CreateActivityThemeCategoryUsecase,
  CreateActivityThemeUsecase,
  CreateActivityUsecase,
  DeleteActivityThemeCategoryUsecase,
  DeleteActivityThemeUsecase,
  DeleteActivityUsecase,
  GetActivitiesUsecase,
  GetActivityPdfUsecase,
  GetActivityThemeCategoryUsecase,
  GetActivityThemeUsecase,
  GetActivityUsecase,
  GetAllActivitiesByAdminUsecase,
  GetAllActivityThemesUsecase,
  UpdateActivityThemeCategoryUsecase,
  UpdateActivityThemeUsecase,
  UpdateActivityUsecase,
  UploadImageActivityUsecase,
  UploadMediaActivityUsecase,
} from 'src/core/usecases';
import { UpdateActivityStatusUsecase } from 'src/core/usecases/activity/update-activity-status.usecase';
import { ActivityWithThemeCategoryResponse } from '../dtos/activity/activity-with-theme-category.response';
import { GetActivitiesByAdminRequest } from '../dtos/activity/get-activities-by-admin.request';
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
    private readonly updateActivityUsecase: UpdateActivityUsecase,
    private readonly updateActivityStatusUsecase: UpdateActivityStatusUsecase,
    private readonly getActivitiesByAdminUsecase: GetAllActivitiesByAdminUsecase,
    private readonly getActivityPdfUsecase: GetActivityPdfUsecase,
    private readonly env: ConfigService<Env, true>,
  ) {
    this.defaultLanguageCode = env.get<string>('DEFAULT_TRANSLATION_LANGUAGE');
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get all public Activity ressources.' })
  async getPublicActivities(
    @Query() query: GetActivitiesRequest,
    @CurrentUser() user: KeycloakUser,
    @Headers('Language-code') languageCode?: string,
  ) {
    const activities = await this.getActivitiesUsecase.execute({
      pagination: {
        page: query.page,
        limit: query.limit,
      },
      searchTitle: query.searchTitle,
      themesIds: query.themesIds,
      languageLevels: query.languageLevels,
      languagesCodes: query.languagesCodes,
      shouldOnlyTakeMine: query.shouldTakeOnlyMine,
      userId: user.sub,
    });

    return new Collection<ActivityResponse>({
      items: activities.items.map((activity) =>
        ActivityResponse.from(activity, languageCode),
      ),
      totalItems: activities.totalItems,
    });
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get all Activity ressources for admin.' })
  @Swagger.ApiOkResponse({ type: () => ActivityWithThemeCategoryResponse })
  async getAllActivitiesByAdmin(
    @Query() query: GetActivitiesByAdminRequest,
    @CurrentUser() user: KeycloakUser,
  ) {
    const activities = await this.getActivitiesByAdminUsecase.execute({
      pagination: {
        page: query.page,
        limit: query.limit,
      },
      searchTitle: query.searchTitle,
      languageCode: query.languageCode,
      languageLevel: query.languageLevel,
      category: query.category,
      theme: query.theme,
      status: query.status,
      university: query.university,
      userId: user.sub,
    });

    return new Collection<ActivityWithThemeCategoryResponse>({
      items: activities.items.map((activity) =>
        ActivityWithThemeCategoryResponse.from(activity),
      ),
      totalItems: activities.totalItems,
    });
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
    const vocabulariesWithFiles = body.vocabularies?.map((vocabulary) => ({
      content: vocabulary,
      pronunciation: files?.find((file) => {
        return (
          file.originalname.toLowerCase().split('.wav')[0] ===
            this.normalizeString(vocabulary) &&
          file.fieldname.includes('vocabulariesFiles')
        );
      }),
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
        page: query?.page,
        limit: query?.limit,
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
  @Swagger.ApiOkResponse({ type: () => ActivityWithThemeCategoryResponse })
  async getActivity(@Param('id') id: string) {
    const activity = await this.getActivityUsecase.execute(id);

    return ActivityWithThemeCategoryResponse.from(activity);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Delete an Activity ressource.' })
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async deleteActivity(@Param('id') id: string) {
    await this.deleteActivityUsecase.execute(id);
  }

  @Put(':id/status')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Activity status ressource.' })
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async updateActivityStatus(
    @Param('id') id: string,
    @Body() body: UpdateActivityStatusRequest,
  ) {
    const activity = await this.updateActivityStatusUsecase.execute({
      id,
      ...body,
    });

    return ActivityResponse.from(activity);
  }

  @Post(':id/update')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @Swagger.ApiOperation({ summary: 'Update a Activity ressource.' })
  @Swagger.ApiConsumes('multipart/form-data')
  @Swagger.ApiOkResponse({ type: () => ActivityResponse })
  async updateActivity(
    @Param('id') id: string,
    @Body() body: UpdateActivityRequest,
    @UploadedFiles()
    files?: Express.Multer.File[],
  ) {
    const vocabulariesWithFiles = body.vocabularies?.map((vocabulary) => ({
      id: vocabulary.id,
      content: vocabulary.content,
      pronunciationUrl: vocabulary.pronunciationUrl,
      pronunciation: files?.find((file) => {
        return (
          file.originalname.toLowerCase().split('.wav')[0] ===
            this.normalizeString(vocabulary.content) &&
          file.fieldname.includes('vocabulariesFiles')
        );
      }),
    }));

    const activity = await this.updateActivityUsecase.execute({
      id,
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

  @Get('pdf/:id')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Get Activity PDF ressource.' })
  async getActivityPdf(
    @Param('id') id: string,
    @Res() res: Response,
    @CurrentUser() user: KeycloakUser,
  ) {
    const pdfBuffer = await this.getActivityPdfUsecase.execute(id, user);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=vocabulary-list.pdf',
    );
    res.send(pdfBuffer);
  }

  private normalizeString(string: string) {
    return string
      .replace('ꜳ', 'aa')
      .replace('æ', 'ae')
      .replace('ꜵ', 'ao')
      .replace('ꜷ', 'au')
      .replace('ꜹ', 'av')
      .replace('ꜽ', 'ay')
      .replace('ȸ', 'db')
      .replace('ue', 'ue')
      .replace('œ', 'oe')
      .replace('ø', 'oe')
      .replace(/ /g, '_')
      .normalize('NFD')
      .toLowerCase()
      .replace(/[\u0300-\u036f]/g, '');
  }
}
