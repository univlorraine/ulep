import { Inject, Injectable } from '@nestjs/common';
import {
  INTEREST_REPOSITORY,
  InterestRepository,
} from '../../ports/interest.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from '../../ports/uuid.provider';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';

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
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateInterestCommand) {
    const category = await this.repository.categoryOfId(command.category);
    if (!category) {
      throw new RessourceDoesNotExist('Category does not exist');
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist();
    }

    return this.repository.createInterest(
      {
        id: command.id,
        name: {
          id: this.uuidProvider.generate(),
          content: command.name,
          language: command.languageCode,
        },
      },
      command.category,
    );
  }
}
