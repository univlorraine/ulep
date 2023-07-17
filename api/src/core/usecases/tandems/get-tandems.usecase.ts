import { Inject, Injectable, Logger } from '@nestjs/common';
import { TANDEM_REPOSITORY } from '../../../providers/providers.module';
import { Collection } from '../../../shared/types/collection';
import { TandemsRepository } from 'src/core/ports/tandems.repository';
import { Tandem } from 'src/core/models/tandem';

export class GetTandemsCommand {
  page: number;
  limit: number;
}

@Injectable()
export class GetTandemsUsecase {
  private readonly logger = new Logger(GetTandemsUsecase.name);

  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemsRepository: TandemsRepository,
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
