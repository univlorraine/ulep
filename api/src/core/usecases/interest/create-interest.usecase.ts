import { Inject, Injectable } from '@nestjs/common';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from '../../ports/interest.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from '../../ports/uuid.provider';
import { RessourceAlreadyExists } from 'src/core/errors';

export class CreateInterestCommand {
  id: string;
  category: string;
  name: string;
  languageCode: string;
}

@Injectable()
export class CreateInterestUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly repository: InterestRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateInterestCommand) {
    const category = await this.repository.categoryOfId(command.category);

    if (!category) {
      throw new RessourceAlreadyExists();
    }

    return this.repository.createInterest({
      id: command.id,
      category,
      name: {
        id: this.uuidProvider.generate(),
        content: command.name,
        language: command.languageCode,
        translations: [],
      },
    });
  }
}
