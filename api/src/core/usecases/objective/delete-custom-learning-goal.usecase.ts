import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  CustomLearningGoalRepository,
  CUSTOM_LEARNING_GOAL_REPOSITORY,
} from 'src/core/ports/custom-learning-goal.repository';

@Injectable()
export class DeleteCustomLearningGoalUsecase {
  constructor(
    @Inject(CUSTOM_LEARNING_GOAL_REPOSITORY)
    private readonly customLearningGoalRepository: CustomLearningGoalRepository,
  ) {}

  async execute(id: string) {
    const instance = await this.customLearningGoalRepository.ofId(id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    await this.customLearningGoalRepository.delete(id);

    const customLearningGoals =
      await this.customLearningGoalRepository.findAllByLearningLanguageId(
        instance.learningLanguageId,
      );

    return customLearningGoals;
  }
}
