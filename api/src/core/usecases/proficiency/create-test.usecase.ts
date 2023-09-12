import { Inject, Injectable } from '@nestjs/common';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from '../../ports/proficiency.repository';
import { ProficiencyLevel } from '../../models/proficiency.model';
import { InvalidLevelException, RessourceAlreadyExists } from 'src/core/errors';
import {
  UUID_PROVIDER,
  UuidProviderInterface,
} from 'src/core/ports/uuid.provider';

export class CreateTestCommand {
  level: ProficiencyLevel;
}

@Injectable()
export class CreateTestUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly proficiencyRepository: ProficiencyRepository,
    @Inject(UUID_PROVIDER)
    private readonly uuidProvider: UuidProviderInterface,
  ) {}

  async execute(command: CreateTestCommand) {
    if (command.level === ProficiencyLevel.A0) {
      throw new InvalidLevelException();
    }

    const instance = await this.proficiencyRepository.testOfLevel(
      command.level,
    );

    if (instance) {
      throw new RessourceAlreadyExists();
    }

    return this.proficiencyRepository.createTest(
      this.uuidProvider.generate(),
      command.level,
    );
  }
}
