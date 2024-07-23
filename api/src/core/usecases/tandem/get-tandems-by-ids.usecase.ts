import { Inject, Injectable } from '@nestjs/common';
import { Tandem } from 'src/core/models';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';

export class GetTandemsByIdsCommand {
  ids: string[];
}

@Injectable()
export class GetTandemsByIdsUsecase {
  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemRepository,
  ) {}

  async execute(command: GetTandemsByIdsCommand): Promise<Tandem[]> {
    const { ids } = command;

    const result = await this.tandemsRepository.ofIds(ids);

    return result;
  }
}
