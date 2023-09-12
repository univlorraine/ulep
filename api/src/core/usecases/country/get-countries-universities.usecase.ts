import { Inject, Injectable } from '@nestjs/common';
import { CountryWithUniversities } from 'src/core/models';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/core/ports/country.repository';

@Injectable()
export class GetCountriesUniversitiesUsecase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(): Promise<CountryWithUniversities[]> {
    const result = await this.countryRepository.allWithUniversities();

    return result;
  }
}
