import { Controller, Get, Query } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { GetNewsUsecase } from 'src/core/usecases/news/get-news.usecase';

@Controller('news')
@Swagger.ApiTags('News')
export class NewsController {
  constructor(private readonly getNewsUsecase: GetNewsUsecase) {}

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
}
