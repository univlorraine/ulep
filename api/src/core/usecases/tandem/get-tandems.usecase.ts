import { Inject, Injectable, Logger } from '@nestjs/common';
import { Collection } from '@app/common';
import { Tandem } from 'src/core/models';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandems.repository';

export class GetTandemsCommand {
  page: number;
  limit: number;
}

@Injectable()
export class GetTandemsUsecase {
  private readonly logger = new Logger(GetTandemsUsecase.name);

  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemRepository,
  ) {}

  async execute(command: GetTandemsCommand): Promise<Collection<Tandem>> {
    const { page, limit } = command;
    const offset = (page - 1) * limit;
    const result = await this.tandemsRepository.findAllActiveTandems(
      offset,
      limit,
    );

    return result;
  }
}
