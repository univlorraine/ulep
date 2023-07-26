import { Controller, Get, SerializeOptions, Post, Body } from '@nestjs/common';
import { GetCountriesUsecase } from '../../core/usecases/countries/get-countries.usecase';
import * as Swagger from '@nestjs/swagger';
import { CollectionResponse } from '../decorators/collection.decorator';
import { Collection } from '../../shared/types/collection';
import { CountryResponse, CreateCountryRequest } from '../dtos/countries';
import { CreateCountryUsecase } from 'src/core/usecases/countries/create-country.usecase';

@Controller('countries')
@Swagger.ApiTags('Countries')
export class CountryController {
  constructor(
    private readonly createCountryUsecase: CreateCountryUsecase,
    private readonly getCountriesUsecase: GetCountriesUsecase,
  ) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Country ressource.',
  })
  @CollectionResponse(CountryResponse)
  async getCollection(): Promise<Collection<CountryResponse>> {
    const countries = await this.getCountriesUsecase.execute();

    return new Collection<CountryResponse>({
      items: countries.items.map(CountryResponse.fromDomain),
      totalItems: countries.totalItems,
    });
  }

  @Post()
  @SerializeOptions({ groups: ['read', 'country:read'] })
  @Swagger.ApiOperation({ summary: 'Create a new Country ressource.' })
  @Swagger.ApiCreatedResponse({ type: CountryResponse })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() body: CreateCountryRequest): Promise<CountryResponse> {
    const country = await this.createCountryUsecase.execute(body);

    return CountryResponse.fromDomain(country);
  }
}
