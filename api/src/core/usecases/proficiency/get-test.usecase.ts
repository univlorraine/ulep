import { Inject, Injectable } from '@nestjs/common';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from '../../ports/proficiency.repository';
import { RessourceDoesNotExist } from 'src/core/errors';

export class GetTestCommand {
  id: string;
}

@Injectable()
export class GetTestUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly proficiencyRepository: ProficiencyRepository,
  ) {}

  async execute(command: GetTestCommand) {
    const test = await this.proficiencyRepository.testOfId(command.id);

    if (!test) {
      throw new RessourceDoesNotExist();
    }

    return test;
  }
}
