import { TandemRepository } from './../../ports/tandems.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { TandemStatus } from 'src/core/models';
import { TANDEM_REPOSITORY } from 'src/core/ports/tandems.repository';

interface UpdateTandemStatusCommand {
  id: string;
  status: TandemStatus;
}

@Injectable()
export class UpdateTandemStatusUsecase {
  private readonly logger = new Logger(UpdateTandemStatusUsecase.name);

  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
  ) {}

  async execute(command: UpdateTandemStatusCommand): Promise<void> {
    const tandem = await this.tandemRepository.ofId(command.id);
    if (!tandem) {
      throw new RessourceDoesNotExist();
    }

    await this.tandemRepository.updateStatus(command.id, command.status);
  }
}
