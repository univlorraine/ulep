import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { GetNewsUsecase } from 'src/core/usecases/news/get-news.usecase';
import { CreateNewsUsecase } from 'src/core/usecases/news/create-news.usecase';
import { CreateNewsRequest, NewsResponse } from '../dtos/news';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesFilePipe } from '../validators';
import { NewsTranslation } from 'src/core/models';
import { Collection } from '@app/common';

@Controller('news')
@Swagger.ApiTags('News')
export class NewsController {
  constructor(
    private readonly getNewsUsecase: GetNewsUsecase,
    private readonly createNewsUsecase: CreateNewsUsecase,
  ) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of News ressource.',
  })
  // @CollectionResponse(NewsResponse)
  async getCollection(): // @Query() params: GetNewsQueryParams,
  Promise<Collection<NewsResponse>> {
    // ): Promise<Collection<NewsResponse>> {
    const news = await this.getNewsUsecase.execute();

    console.log({ news });

    return new Collection<NewsResponse>({
      items: news.items.map(NewsResponse.fromDomain),
      totalItems: news.totalItems,
    });
  }

  @Post()
  @Swagger.ApiOperation({
    summary: 'Create a new News ressource.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() payload: CreateNewsRequest,
    @UploadedFile(new ImagesFilePipe()) file: Express.Multer.File,
  ): Promise<NewsResponse> {
    const translations: NewsTranslation[] = JSON.parse(payload.translations);

    const news = await this.createNewsUsecase.execute({
      ...payload,
      translations,
    });

    return NewsResponse.fromDomain(news);
  }
}
