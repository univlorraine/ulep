import { Inject, Injectable } from '@nestjs/common';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from '../../ports/interest.repository';
import { RessourceDoesNotExist } from 'src/core/errors';

export class DeleteInterestCategoryCommand {
  id: string;
}

@Injectable()
export class DeleteInterestCategoryUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly repository: InterestRepository,
  ) {}

  async execute(command: DeleteInterestCategoryCommand) {
    const instance = await this.repository.categoryOfId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return this.repository.deleteCategory(instance);
  }
}
