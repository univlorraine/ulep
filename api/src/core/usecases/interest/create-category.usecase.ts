import { Inject, Injectable } from '@nestjs/common';
import { RessourceAlreadyExists, RessourceDoesNotExist } from 'src/core/errors';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from '../../ports/uuid.provider';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from 'src/core/ports/interest.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';

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
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateInterestCategoryCommand) {
    const instance = await this.repository.categoryOfId(command.id);
    if (instance) {
      throw new RessourceAlreadyExists();
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist();
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
