import { Inject, Injectable } from '@nestjs/common';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from '../../ports/proficiency.repository';
import { RessourceDoesNotExist } from 'src/core/errors';

export class DeleteQuestionCommand {
  id: string;
}

@Injectable()
export class DeleteQuestionUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly proficiencyRepository: ProficiencyRepository,
  ) {}

  async execute(command: DeleteQuestionCommand) {
    const question = await this.proficiencyRepository.questionOfId(command.id);

    if (!question) {
      throw new RessourceDoesNotExist();
    }

    return this.proficiencyRepository.removeQuestion(question.id);
  }
}
