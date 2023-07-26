import { Inject, Injectable } from '@nestjs/common';
import { Country } from '../../models/country';
import { CountryRepository } from '../../ports/country.repository';
import { COUNTRY_REPOSITORY } from '../../../providers/providers.module';
import { Collection } from '../../../shared/types/collection';

@Injectable()
export class GetCountriesUsecase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(): Promise<Collection<Country>> {
    const result = await this.countryRepository.findAll({
      orderBy: { name: 'asc' },
    });

    return result;
  }
}
