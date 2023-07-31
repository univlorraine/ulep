import { Inject, Injectable } from '@nestjs/common';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from '../../ports/proficiency.repository';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from '../../ports/uuid.provider';
import { RessourceDoesNotExist } from 'src/core/errors';

export class CreateQuestionCommand {
  id: string;
  test: string;
  value: string;
  languageCode: string;
  answer: boolean;
}

@Injectable()
export class CreateQuestionUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly proficiencyRepository: ProficiencyRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateQuestionCommand) {
    const test = await this.proficiencyRepository.testOfId(command.test);
    if (!test) {
      throw new RessourceDoesNotExist();
    }

    return this.proficiencyRepository.createQuestion(test.id, {
      id: command.id,
      text: {
        id: this.uuidProvider.generate(),
        content: command.value,
        language: command.languageCode,
        translations: [],
      },
      answer: command.answer,
    });
  }
}
