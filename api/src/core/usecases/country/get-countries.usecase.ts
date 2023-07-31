import { Collection } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { CountryCode } from 'src/core/models';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/core/ports/country.repository';

export class GetCountriesCommand {
  enable?: boolean;
  page?: number;
  limit?: number;
}

@Injectable()
export class GetCountriesUsecase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(
    command: GetCountriesCommand,
  ): Promise<Collection<CountryCode>> {
    const result = await this.countryRepository.all({
      where: { enable: command.enable },
      orderBy: { name: 'asc' },
      page: command.page,
      limit: command.limit,
    });

    return result;
  }
}
