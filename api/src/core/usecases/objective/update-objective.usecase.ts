import { Inject, Injectable } from '@nestjs/common';
import { DomainErrorCode, RessourceDoesNotExist } from 'src/core/errors';
import { Translation } from 'src/core/models';
import { LANGUAGE_REPOSITORY } from 'src/core/ports/language.repository';
import {
  OBJECTIVE_REPOSITORY,
  LearningObjectiveRepository,
} from 'src/core/ports/objective.repository';

export class UpdateObjectiveCommand {
  id: string;
  name: string;
  languageCode: string;
  translations?: Translation[];
}

@Injectable()
export class UpdateObjectiveUsecase {
  constructor(
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository,
  ) {}

  async execute(command: UpdateObjectiveCommand) {
    const instance = await this.objectiveRepository.ofId(command.id);
    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    const language = await this.languageRepository.ofCode(command.languageCode);
    if (!language) {
      throw new RessourceDoesNotExist(
        'Language not found',
        DomainErrorCode.BAD_REQUEST,
      );
    }

    return this.objectiveRepository.update({
      id: command.id,
      name: {
        id: instance.name.id,
        content: command.name,
        language: language.code,
        translations: command.translations,
      },
    });
  }
}
