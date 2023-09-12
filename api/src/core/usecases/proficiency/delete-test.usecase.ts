import { Inject, Injectable } from '@nestjs/common';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from '../../ports/proficiency.repository';
import { RessourceDoesNotExist } from 'src/core/errors';

export class DeleteTestCommand {
  id: string;
}

@Injectable()
export class DeleteTestUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly proficiencyRepository: ProficiencyRepository,
  ) {}

  async execute(command: DeleteTestCommand) {
    const test = await this.proficiencyRepository.testOfId(command.id);

    if (!test) {
      throw new RessourceDoesNotExist();
    }

    return this.proficiencyRepository.removeTest(test.level);
  }
}
