import { Inject, Injectable } from '@nestjs/common';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from '../../ports/interest.repository';

@Injectable()
export class GetInterestsByCategoriesUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly interestRepository: InterestRepository,
  ) {}

  async execute() {
    return this.interestRepository.interestByCategories();
  }
}
