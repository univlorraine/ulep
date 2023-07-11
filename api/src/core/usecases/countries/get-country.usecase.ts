import { Inject, Injectable } from '@nestjs/common';
import { Country } from '../../models/country';
import { CountryRepository } from '../../ports/country.repository';
import { COUNTRY_REPOSITORY } from '../../../providers/providers.module';
import { CountryDoesNotExist } from 'src/core/errors/RessourceDoesNotExist';

export type GetCountryCommand = {
  id: string;
};

@Injectable()
export class GetCountryUsecase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(command: GetCountryCommand): Promise<Country> {
    const result = await this.countryRepository.of(command.id);

    if (!result) {
      throw CountryDoesNotExist.withIdOf(command.id);
    }

    return result;
  }
}
