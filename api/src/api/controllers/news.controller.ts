import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { GetNewsUsecase } from 'src/core/usecases/news/get-news.usecase';
import { CreateNewsUsecase } from 'src/core/usecases/news/create-news.usecase';
import { CreateNewsRequest } from '../dtos/news';

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
  Promise<void> {
    // ): Promise<Collection<NewsResponse>> {
    const news = await this.getNewsUsecase.execute();

    console.log({ news });

    /*     return new Collection<NewsResponse>({
      items: news.items.map(NewsResponse.fromDomain),
      totalItems: news.totalItems,
    }); */
  }

  @Post()
  @Swagger.ApiOperation({
    summary: 'Create a new News ressource.',
  })
  async create(@Body() payload: CreateNewsRequest): Promise<void> {
    console.log('dans la route !');
    const news = await this.createNewsUsecase.execute(payload);

    console.log({ news });
  }
}
