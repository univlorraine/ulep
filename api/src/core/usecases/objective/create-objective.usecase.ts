import { Inject, Injectable } from '@nestjs/common';
import {
  DomainErrorCode,
  RessourceAlreadyExists,
  RessourceDoesNotExist,
} from 'src/core/errors';
import { Translation } from 'src/core/models';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import {
  OBJECTIVE_REPOSITORY,
  LearningObjectiveRepository,
} from 'src/core/ports/objective.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export class CreateObjectiveCommand {
  file: Express.Multer.File;
  languageCode: string;
  name: string;
  translations?: Translation[];
}

@Injectable()
export class CreateObjectiveUsecase {
  constructor(
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateObjectiveCommand) {
    const instance = await this.objectiveRepository.ofName(command.name);
    if (instance) {
      throw new RessourceAlreadyExists();
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist(
        'Language not found',
        DomainErrorCode.BAD_REQUEST,
      );
    }

    return this.objectiveRepository.create({
      id: this.uuidProvider.generate(),
      name: {
        id: this.uuidProvider.generate(),
        content: command.name,
        language: language.code,
        translations: command.translations,
      },
    });
  }
}
