import { Inject, Injectable } from '@nestjs/common';
import { ProficiencyLevel } from 'src/core/models';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from 'src/core/ports/proficiency.repository';

export interface GetQuestionsCommand {
  limit?: number;
  page?: number;
  where?: ProficiencyLevel;
}

@Injectable()
export class GetQuestionsUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly repository: ProficiencyRepository,
  ) {}

  async execute(command: GetQuestionsCommand) {
    const { page = 1, limit = 30, where } = command;
    const offset = (page - 1) * limit;
    const questions = await this.repository.findAllQuestions(
      offset,
      limit,
      where,
    );

    return questions;
  }
}
