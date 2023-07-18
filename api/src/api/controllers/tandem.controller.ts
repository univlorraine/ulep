import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { CreateTandemUsecase } from 'src/core/usecases/tandems/create-tandem.usecase';
import { CreateTandemRequest, TandemResponse } from '../dtos/tandems';
import { UuidProvider } from '../services/uuid-provider';
import { GetTandemsUsecase } from 'src/core/usecases/tandems/get-tandems.usecase';
import { CollectionResponse } from '../decorators/collection.decorator';
import { PaginationDto } from '../dtos/pagination.dto';
import { Collection } from 'src/shared/types/collection';
import { GenerateTandemsUsecase } from 'src/core/usecases/tandems/generate-tandems.usecase';

@Controller('tandems')
@Swagger.ApiTags('Tandems')
export class TandemController {
  constructor(
    private readonly uuidProvider: UuidProvider,
    private readonly generateTandemsUsecase: GenerateTandemsUsecase,
    private readonly getTandemsUsecase: GetTandemsUsecase,
    private readonly createTandemUsecase: CreateTandemUsecase,
  ) {}

  @Get()
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
  @Swagger.ApiOperation({ summary: 'Creates a Tandem ressource.' })
  async create(@Body() body: CreateTandemRequest): Promise<void> {
    await this.createTandemUsecase.execute({
      id: this.uuidProvider.generate(),
      ...body,
    });
  }

  @Post('generate')
  @Swagger.ApiOperation({ summary: 'Generate Tandems' })
  async generate(): Promise<TandemResponse[]> {
    const tandems = await this.generateTandemsUsecase.execute();

    return tandems.map(
      (tandem) =>
        new TandemResponse({
          profiles: tandem.profiles.map((profile) => profile.id),
          status: 'draft',
          score: tandem.score,
        }),
    );
  }
}
