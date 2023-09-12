import { Inject, Injectable } from '@nestjs/common';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from '../../ports/interest.repository';

interface GetInterestCategoryCommand {
  id: string;
}

@Injectable()
export class GetInterestCategoryUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly interestRepository: InterestRepository,
  ) {}

  async execute(command: GetInterestCategoryCommand) {
    return this.interestRepository.categoryOfId(command.id);
  }
}
