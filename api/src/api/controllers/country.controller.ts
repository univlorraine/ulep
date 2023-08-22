import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Collection } from '@app/common';
import { CollectionResponse } from '../decorators';
import {
  GetCountriesUsecase,
  UpdateCountryStatusUsecase,
} from 'src/core/usecases';
import {
  CountryResponse,
  GetCountriesQueryParams,
  UpdateCountryRequest,
} from '../dtos';
import { configuration } from 'src/configuration';
import { Roles } from '../decorators/roles.decorator';
import { AuthenticationGuard } from '../guards';

@Controller('countries')
@Swagger.ApiTags('Countries')
export class CountryController {
  constructor(
    private readonly getCountriesUsecase: GetCountriesUsecase,
    private readonly updateCountryStatusUsecase: UpdateCountryStatusUsecase,
  ) {}

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Country ressource.',
  })
  @CollectionResponse(CountryResponse)
  async getCollection(
    @Query() params: GetCountriesQueryParams,
  ): Promise<Collection<CountryResponse>> {
    const countries = await this.getCountriesUsecase.execute({ ...params });

    return new Collection<CountryResponse>({
      items: countries.items.map(CountryResponse.fromDomain),
      totalItems: countries.totalItems,
    });
  }

  @Patch(':id')
  @Roles(configuration().adminRole)
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({ summary: 'Update a Country ressource.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCountryRequest,
  ): Promise<void> {
    await this.updateCountryStatusUsecase.execute({ id, ...body });
  }
}
