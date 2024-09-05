import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationGuard } from '../guards';
import * as Swagger from '@nestjs/swagger';
import { Role, Roles } from '../decorators/roles.decorator';
import { GetNewsUsecase } from 'src/core/usecases/news/get-news.usecase';
import { CreateNewsUsecase } from 'src/core/usecases/news/create-news.usecase';
import {
  CreateNewsRequest,
  NewsResponse,
  UpdateNewsRequest,
} from '../dtos/news';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesFilePipe } from '../validators';
import { News, NewsTranslation } from 'src/core/models';
import { Collection } from '@app/common';
import { CollectionResponse } from '../decorators';
import {
  DeleteNewsImageUsecase,
  DeleteNewsUsecase,
  GetOneNewsUsecase,
  UpdateNewsUsecase,
  UploadNewsImageUsecase,
} from 'src/core/usecases';

@Controller('news')
@Swagger.ApiTags('News')
export class NewsController {
  constructor(
    private readonly getNewsUsecase: GetNewsUsecase,
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
  async getCollection(): // @Query() params: GetNewsQueryParams,
  Promise<Collection<NewsResponse>> {
    const news = await this.getNewsUsecase.execute();

    return new Collection<NewsResponse>({
      items: news.items.map(NewsResponse.fromDomain),
      totalItems: news.totalItems,
    });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
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
    const translations: NewsTranslation[] = JSON.parse(payload.translations);

    let news = await this.createNewsUsecase.execute({
      ...payload,
      translations,
    });

    if (file) {
      const upload = await this.uploadNewsImageUsecase.execute({
        id: news.id,
        file,
      });

      news = new News({ ...news, image: upload });
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
    const translations: NewsTranslation[] = JSON.parse(payload.translations);

    let news = await this.updateNewsUsecase.execute({
      ...payload,
      translations,
    });

    if (file) {
      const upload = await this.uploadNewsImageUsecase.execute({
        id: news.id,
        file,
      });

      news = new News({ ...news, image: upload });
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
