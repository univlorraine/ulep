import { Inject, Injectable } from '@nestjs/common';
import { ProficiencyTest } from 'src/core/models';
import {
  PROFICIENCY_REPOSITORY,
  ProficiencyRepository,
} from 'src/core/ports/proficiency.repository';

@Injectable()
export class GetTestsUsecase {
  constructor(
    @Inject(PROFICIENCY_REPOSITORY)
    private readonly proficiencyRepository: ProficiencyRepository,
  ) {}

  async execute(): Promise<ProficiencyTest[]> {
    return this.proficiencyRepository.findAllTests();
  }
}
