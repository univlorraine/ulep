import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LearningObjectiveRepository,
  OBJECTIVE_REPOSITORY,
} from 'src/core/ports/objective.repository';

export class DeleteObjectiveCommand {
  id: string;
}

@Injectable()
export class DeleteObjectiveUsecase {
  constructor(
    @Inject(OBJECTIVE_REPOSITORY)
    private readonly objectiveRepository: LearningObjectiveRepository,
  ) {}

  async execute(command: DeleteObjectiveCommand) {
    const instance = await this.objectiveRepository.ofId(command.id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    return this.objectiveRepository.delete(command.id);
  }
}
