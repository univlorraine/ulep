import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Country } from 'src/core/models/country';
import { GetCountriesUsecase } from 'src/core/usecases/countries/get-countries.usecase';
import { Collection } from 'src/shared/types/collection';
import * as Swagger from '@nestjs/swagger';
import Timezone from 'src/core/models/timezone';

@Controller('countries')
@ApiExcludeController()
export class CountriesController {
  constructor(private getCountriesUsecase: GetCountriesUsecase) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Country ressource.',
  })
  @Swagger.ApiOkResponse({ type: Country, isArray: true })
  async getCollection(): Promise<Collection<Country>> {
    return this.getCountriesUsecase.execute();
  }

  @Get('timezones')
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Timezones ressource.',
  })
  @Swagger.ApiOkResponse({ type: String, isArray: true })
  async getTimezoneCollection(): Promise<Collection<string>> {
    const timezones = Object.values(Timezone);
    return { items: timezones, total: timezones.length };
  }
}
