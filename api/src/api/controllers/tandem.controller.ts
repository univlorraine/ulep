import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Collection } from '@app/common';
import { CollectionResponse } from '../decorators';
import { CreateTandemUsecase } from '../../core/usecases/tandem/create-tandem.usecase';
import { GenerateTandemsUsecase } from '../../core/usecases/tandem/generate-tandems.usecase';
import { GetTandemsUsecase } from '../../core/usecases/tandem/get-tandems.usecase';
import { CreateTandemRequest, PaginationDto, TandemResponse } from '../dtos';
import { Roles } from '../decorators/roles.decorator';
import { configuration } from 'src/configuration';
import { AuthenticationGuard } from '../guards';
import { GenerateTandemsRequest } from '../dtos/tandems/generate-tandems.request';

@Controller('tandems')
@Swagger.ApiTags('Tandems')
export class TandemController {
  constructor(
    private readonly generateTandemsUsecase: GenerateTandemsUsecase,
    private readonly getTandemsUsecase: GetTandemsUsecase,
    private readonly createTandemUsecase: CreateTandemUsecase,
  ) {}

  @Get()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Tandem ressource.',
  })
  @CollectionResponse(TandemResponse)
  async getCollection(
    @Query() { page, limit }: PaginationDto,
  ): Promise<Collection<TandemResponse>> {
    const result = await this.getTandemsUsecase.execute({ page, limit });

    return new Collection<TandemResponse>({
      items: result.items.map(TandemResponse.fromDomain),
      totalItems: result.totalItems,
    });
  }

  @Post()
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Creates a Tandem ressource.' })
  async create(@Body() body: CreateTandemRequest): Promise<TandemResponse> {
    const tandem = await this.createTandemUsecase.execute(body);
    return TandemResponse.fromDomain(tandem);
  }

  @Post('generate')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Generate Tandems' })
  async generate(
    @Body() body: GenerateTandemsRequest,
  ): Promise<TandemResponse[]> {
    const tandems = await this.generateTandemsUsecase.execute(body);

    return tandems.map(TandemResponse.fromDomain);
  }
}
