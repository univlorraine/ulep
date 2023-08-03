import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LearningObjectiveRepository,
  OBJECTIVE_REPOSITORY,
} from 'src/core/ports/objective.repository';

@Injectable()
export class FindOneObjectiveUsecase {
  constructor(
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
  ) {}

  async execute(id: string) {
    const instance = await this.objectiveRepository.ofId(id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return instance;
  }
}
