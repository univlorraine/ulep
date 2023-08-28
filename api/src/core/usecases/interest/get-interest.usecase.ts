import { Inject, Injectable } from '@nestjs/common';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from '../../ports/interest.repository';

interface GetInterestCommand {
  id: string;
}

@Injectable()
export class GetInterestUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly interestRepository: InterestRepository,
  ) {}

  async execute(command: GetInterestCommand) {
    return this.interestRepository.interestOfId(command.id);
  }
}
