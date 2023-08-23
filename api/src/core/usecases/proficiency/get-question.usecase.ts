import { Inject, Injectable } from '@nestjs/common';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from 'src/core/ports/proficiency.repository';

export interface GetQuestionCommand {
  id: string;
}

@Injectable()
export class GetQuestionUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly repository: ProficiencyRepository,
  ) {}

  async execute(command: GetQuestionCommand) {
    return await this.repository.questionOfId(command.id);
  }
}
