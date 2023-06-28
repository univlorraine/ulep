import { Controller, Get } from '@nestjs/common';
import { GetCountriesUsecase } from '../../core/usecases/countries/get-countries.usecase';
import * as Swagger from '@nestjs/swagger';
import { CountryResponse } from '../dtos/countries/country.response';
import { CollectionResponse } from '../decorators/collection.decorator';
import { Collection } from '../../shared/types/collection';

@Controller('countries')
@Swagger.ApiTags('Countries')
export class CountryController {
  constructor(private getCountriesUsecase: GetCountriesUsecase) {}

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
}
