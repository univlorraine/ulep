import { Inject, Injectable, Logger } from '@nestjs/common';
import { Country } from 'src/core/models/country';
import { CountryRepository } from 'src/core/ports/country.repository';
import { COUNTRY_REPOSITORY } from 'src/providers/providers.module';
import { Collection } from 'src/shared/types/collection';

@Injectable()
export class GetCountriesUsecase {
  private readonly logger = new Logger(GetCountriesUsecase.name);

  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(): Promise<Collection<Country>> {
    const result = await this.countryRepository.findAll();

    return result;
  }
}
