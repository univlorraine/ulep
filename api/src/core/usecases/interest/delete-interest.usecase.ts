import { Inject, Injectable } from '@nestjs/common';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from '../../ports/interest.repository';
import { RessourceDoesNotExist } from 'src/core/errors';

export class DeleteInterestCommand {
  id: string;
}

@Injectable()
export class DeleteInterestUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly repository: InterestRepository,
  ) {}

  async execute(command: DeleteInterestCommand) {
    const instance = await this.repository.interestOfId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return this.repository.deleteInterest(instance);
  }
}
