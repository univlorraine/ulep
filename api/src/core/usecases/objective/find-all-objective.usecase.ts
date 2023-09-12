import { Inject, Injectable } from '@nestjs/common';
import {
  LearningObjectiveRepository,
  OBJECTIVE_REPOSITORY,
} from 'src/core/ports/objective.repository';

@Injectable()
export class FindAllObjectiveUsecase {
  constructor(
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
  ) {}

  async execute() {
    return this.objectiveRepository.all();
  }
}
