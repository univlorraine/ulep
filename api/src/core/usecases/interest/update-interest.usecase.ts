import { Inject, Injectable } from '@nestjs/common';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from '../../ports/interest.repository';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Translation } from 'src/core/models';

export class UpdateInterestCommand {
  id: string;
  name: string;
  translations?: Translation[];
}

@Injectable()
export class UpdateInterestUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly repository: InterestRepository,
  ) {}

  async execute(command: UpdateInterestCommand) {
    const interest = await this.repository.interestOfId(command.id);
    if (!interest) {
      throw new RessourceDoesNotExist('Interest does not exist');
    }

    return this.repository.updateInterest({
      id: interest.id,
      category: interest.category,
      name: {
        id: interest.name.id,
        content: command.name,
        language: interest.name.language,
        translations: command.translations,
      },
    });
  }
}
