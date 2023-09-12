import { Inject, Injectable } from '@nestjs/common';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from '../../ports/interest.repository';
import { SortOrder } from '@app/common';

interface GetInterestsByCategoriesCommand {
  order?: SortOrder;
  limit?: number;
  page?: number;
}

@Injectable()
export class GetInterestsByCategoriesUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly interestRepository: InterestRepository,
  ) {}

  async execute(command: GetInterestsByCategoriesCommand) {
    const { page = 1, limit = 30, order } = command;
    const offset = (page - 1) * limit;
    return this.interestRepository.interestByCategories(offset, limit, order);
  }
}
