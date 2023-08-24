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
    const interest = await this.repository.categoryOfId(command.id);
    if (!interest) {
      throw new RessourceDoesNotExist('Category does not exist');
    }

    return this.repository.updateInterestCategory({
      id: interest.id,
      name: {
        id: interest.name.id,
        content: command.name,
        language: interest.name.language,
        translations: command.translations,
      },
    });
  }
}
