import { Inject, Injectable } from '@nestjs/common';
import { RessourceAlreadyExists } from '../../errors/RessourceAlreadyExists';
import { LANGUAGE_REPOSITORY } from '../../../providers/providers.module';
import { CountryRepository } from 'src/core/ports/country.repository';
import { Country } from 'src/core/models/country';

export class CreateCountryCommand {
  code: string;
  name: string;
}

@Injectable()
export class CreateCountryUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(command: CreateCountryCommand): Promise<Country> {
    await this.assertCountryDoesNotExistForCode(command.code);

    const instance = { ...command };

    await this.countryRepository.save(instance);

    return instance;
  }

  private async assertCountryDoesNotExistForCode(code: string): Promise<void> {
    const country = await this.countryRepository.ofCode(code);

    if (country) {
      throw new RessourceAlreadyExists('Country', 'code', code);
    }
  }
}
