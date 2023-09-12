import { Inject, Injectable } from '@nestjs/common';
import { ProficiencyLevel } from 'src/core/models';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from 'src/core/ports/proficiency.repository';

export interface GetQuestionsByLevelCommand {
  level: ProficiencyLevel;
}

@Injectable()
export class GetQuestionsByLevelUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly repository: ProficiencyRepository,
  ) {}

  async execute(command: GetQuestionsByLevelCommand) {
    const { level } = command;

    const test = await this.repository.testOfLevel(level);

    if (!test) {
      return [];
    }

    return test.questions;
  }
}
