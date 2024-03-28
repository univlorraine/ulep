import { Inject, Injectable } from '@nestjs/common';
import { Collection } from '@app/common';
import { Tandem, TandemStatus } from 'src/core/models';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';

export class GetTandemsCommand {
  page: number;
  limit: number;
}

@Injectable()
export class GetTandemsUsecase {
  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemRepository,
  ) {}

  async execute(command: GetTandemsCommand): Promise<Collection<Tandem>> {
    const { page = 1, limit = 30 } = command;
    const offset = (page - 1) * limit;

    const result = await this.tandemsRepository.findWhere({
      status: TandemStatus.ACTIVE,
      offset,
      limit,
    });

    return result;
  }
}
