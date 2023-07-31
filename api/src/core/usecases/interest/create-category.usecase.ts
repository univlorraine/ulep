import { Inject, Injectable } from '@nestjs/common';
import { RessourceAlreadyExists } from 'src/core/errors';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from '../../ports/uuid.provider';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from 'src/core/ports/interest.repository';

export class CreateInterestCategoryCommand {
  id: string;
  name: string;
  languageCode: string;
}

@Injectable()
export class CreateInterestCategoryUsecase {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly repository: InterestRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateInterestCategoryCommand) {
    const instance = await this.repository.categoryOfId(command.id);

    if (instance) {
      throw new RessourceAlreadyExists();
    }

    return this.repository.createCategory({
      id: command.id,
      name: {
        id: this.uuidProvider.generate(),
        content: command.name,
        language: command.languageCode,
        translations: [],
      },
    });
  }
}
