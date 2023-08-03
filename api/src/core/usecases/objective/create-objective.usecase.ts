import { Inject, Injectable } from '@nestjs/common';
import {
  DomainErrorCode,
  RessourceAlreadyExists,
  RessourceDoesNotExist,
} from 'src/core/errors';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import {
  OBJECTIVE_REPOSITORY,
  LearningObjectiveRepository,
} from 'src/core/ports/objective.repository';

export class CreateObjectiveCommand {
  id: string;
  name: string;
  languageCode: string;
}

@Injectable()
export class CreateObjectiveUsecase {
  constructor(
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository,
  ) {}

  async execute(command: CreateObjectiveCommand) {
    const instance = await this.objectiveRepository.ofId(command.id);
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
      id: command.id,
      name: {
        id: command.id,
        content: command.name,
        language: language.code,
      },
    });
  }
}
