import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { GetCountriesUsecase } from '../../core/usecases/countries/get-countries.usecase';
import * as Swagger from '@nestjs/swagger';
import { CountryResponse } from '../dtos/countries/country.response';
import { CollectionResponse } from '../decorators/collection.decorator';
import { Collection } from '../../shared/types/collection';
import { GetCountryUsecase } from 'src/core/usecases/countries/get-country.usecase';

@Controller('countries')
@Swagger.ApiTags('Countries')
export class CountryController {
  constructor(
    private getCountriesUsecase: GetCountriesUsecase,
    private getCountryUsecase: GetCountryUsecase,
  ) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Country ressource.',
  })
  @CollectionResponse(CountryResponse)
  async getCollection(): Promise<Collection<CountryResponse>> {
    const countries = await this.getCountriesUsecase.execute();

    return new Collection<CountryResponse>(
      countries.items.map(CountryResponse.fromDomain),
      countries.totalItems,
    );
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Retrieve a Country ressource.' })
  @Swagger.ApiOkResponse({ type: CountryResponse })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CountryResponse> {
    const instance = await this.getCountryUsecase.execute({ id });

    return CountryResponse.fromDomain(instance);
  }
}
