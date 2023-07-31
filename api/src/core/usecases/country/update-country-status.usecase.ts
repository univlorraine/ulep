import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/core/ports/country.repository';

export class UpdateCountryStatusCommand {
  id: string;
  enable: boolean;
}

@Injectable()
export class UpdateCountryStatusUsecase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly repository: CountryRepository,
  ) {}

  async execute(command: UpdateCountryStatusCommand): Promise<void> {
    const country = await this.repository.ofCode(command.id);

    if (!country) {
      throw new RessourceDoesNotExist();
    }

    if (country.enable === command.enable) {
      return;
    }

    await this.repository.toogleStatus(command.id, command.enable);
  }
}
