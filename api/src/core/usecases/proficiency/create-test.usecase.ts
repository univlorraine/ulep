import { Inject, Injectable } from '@nestjs/common';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from '../../ports/proficiency.repository';
import { ProficiencyLevel } from '../../models/proficiency.model';
import { RessourceAlreadyExists } from 'src/core/errors';

export class CreateTestCommand {
  level: ProficiencyLevel;
}

@Injectable()
export class CreateTestUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly proficiencyRepository: ProficiencyRepository,
  ) {}

  async execute(command: CreateTestCommand) {
    const instance = await this.proficiencyRepository.testOfLevel(
      command.level,
    );

    if (instance) {
      throw new RessourceAlreadyExists();
    }

    return this.proficiencyRepository.createTest(command.level);
  }
}
