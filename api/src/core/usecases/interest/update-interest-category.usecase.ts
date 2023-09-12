import { Inject, Injectable } from '@nestjs/common';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from '../../ports/interest.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Translation } from 'src/core/models';

export class UpdateInterestCategoryCommand {
  id: string;
  name: string;
  translations?: Translation[];
}

@Injectable()
export class UpdateInterestCategoryUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly repository: InterestRepository,
  ) {}

  async execute(command: UpdateInterestCategoryCommand) {
    const category = await this.repository.categoryOfId(command.id);
    if (!category) {
      throw new RessourceDoesNotExist('Category does not exist');
    }

    return this.repository.updateInterestCategory({
      id: category.id,
      name: {
        id: category.name.id,
        content: command.name,
        language: category.name.language,
        translations: command.translations,
      },
    });
  }
}
