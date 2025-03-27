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
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { News } from 'src/core/models';
import {
  DeleteNewsImageUsecase,
  DeleteNewsUsecase,
  GetNewsAdminUsecase,
  GetNewsUsecase,
  GetOneNewsUsecase,
  UpdateNewsUsecase,
  UploadNewsImageUsecase,
} from 'src/core/usecases';
import { CreateNewsUsecase } from 'src/core/usecases/news/create-news.usecase';
import { CollectionResponse, CurrentUser } from '../decorators';
import { Role, Roles } from '../decorators/roles.decorator';
import {
  CreateNewsRequest,
  GetNewsAdminQuery,
  GetNewsQuery,
  NewsResponse,
  UpdateNewsRequest,
} from '../dtos/news';
import { AuthenticationGuard } from '../guards';
import { ImagesFilePipe } from '../validators';

@Controller('news')
@Swagger.ApiTags('News')
export class NewsController {
  constructor(
    private readonly getNewsUsecase: GetNewsUsecase,
    private readonly getNewsAdminUsecase: GetNewsAdminUsecase,
    private readonly getOneNewsUsecase: GetOneNewsUsecase,
    private readonly createNewsUsecase: CreateNewsUsecase,
    private readonly updateNewsUsecase: UpdateNewsUsecase,
    private readonly uploadNewsImageUsecase: UploadNewsImageUsecase,
    private readonly deleteNewsImageUsecase: DeleteNewsImageUsecase,
    private readonly deleteNewsUsecase: DeleteNewsUsecase,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of News ressource.',
  })
  @Swagger.ApiOkResponse({ type: NewsResponse })
  @CollectionResponse(NewsResponse)
  async getCollection(
    @CurrentUser() user: KeycloakUser,
    @Query() query: GetNewsQuery,
  ): Promise<Collection<NewsResponse>> {
    const { page, limit, title, languageCodes } = query;

    const news = await this.getNewsUsecase.execute({
      user,
      page: Number(page),
      limit: Number(limit),
      where: {
        title,
        languageCodes,
      },
    });

    return new Collection<NewsResponse>({
      items: news.items.map(NewsResponse.fromDomain),
      totalItems: news.totalItems,
    });
  }

  @Get('admin')
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of News ressource for back-office.',
  })
  @Swagger.ApiOkResponse({ type: NewsResponse })
  @CollectionResponse(NewsResponse)
  async getCollectionForUser(
    @Query() query: GetNewsAdminQuery,
  ): Promise<Collection<NewsResponse>> {
    const {
      page,
      limit,
      title,
      universityIds,
      status,
      languageCodes,
      field,
      order,
    } = query;

    const news = await this.getNewsAdminUsecase.execute({
      page,
      limit,
      where: {
        title,
        universityIds,
        status,
        languageCodes:
          typeof languageCodes === 'string' ? [languageCodes] : languageCodes,
      },
      orderBy: field && order && { field, order },
    });

    return new Collection<NewsResponse>({
      items: news.items.map(NewsResponse.fromDomain),
      totalItems: news.totalItems,
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @SerializeOptions({ groups: ['read'] })
  @Swagger.ApiOperation({ summary: 'Retreive one News ressource.' })
  @Swagger.ApiOkResponse({ type: NewsResponse })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const news = await this.getOneNewsUsecase.execute(id);

    return NewsResponse.fromDomain(news);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Create a News ressource.' })
  @Swagger.ApiOkResponse({ type: NewsResponse })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() payload: CreateNewsRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ): Promise<NewsResponse> {
    let news = await this.createNewsUsecase.execute({
      ...payload,
      startPublicationDate: new Date(payload.startPublicationDate),
      endPublicationDate: new Date(payload.endPublicationDate),
    });

    if (file) {
      const uploadURL = await this.uploadNewsImageUsecase.execute({
        id: news.id,
        file,
      });

      news = new News({ ...news, imageURL: uploadURL });
    }

    return NewsResponse.fromDomain(news);
  }

  @Put()
  @UseGuards(AuthenticationGuard)
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Update a News ressource.' })
  @Swagger.ApiOkResponse({ type: NewsResponse })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Body() payload: UpdateNewsRequest,
    @UploadedFile(new ImagesFilePipe()) file?: Express.Multer.File,
  ): Promise<NewsResponse> {
    let news = await this.updateNewsUsecase.execute({
      ...payload,
      startPublicationDate: new Date(payload.startPublicationDate),
      endPublicationDate: new Date(payload.endPublicationDate),
    });

    if (file) {
      const uploadURL = await this.uploadNewsImageUsecase.execute({
        id: news.id,
        file,
      });

      news = new News({ ...news, imageURL: uploadURL });
    }

    return NewsResponse.fromDomain(news);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  @Roles(Role.ADMIN)
  @Swagger.ApiOperation({ summary: 'Update a News ressource.' })
  @Swagger.ApiOkResponse()
  @UseInterceptors(FileInterceptor('file'))
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteNewsImageUsecase.execute({ id });
    await this.deleteNewsUsecase.execute({ id });

    return;
  }
}
