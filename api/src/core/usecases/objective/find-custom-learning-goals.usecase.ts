import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { CustomLearningGoal } from 'src/core/models';
import {
  CustomLearningGoalRepository,
  CUSTOM_LEARNING_GOAL_REPOSITORY,
} from 'src/core/ports/custom-learning-goal.repository';

@Injectable()
export class FindCustomLearningGoalsUsecase {
  constructor(
    @Inject(CUSTOM_LEARNING_GOAL_REPOSITORY)
    private readonly customLearningGoalRepository: CustomLearningGoalRepository,
  ) {}

  async execute(learningLanguageId: string): Promise<CustomLearningGoal[]> {
    const customLearningGoals =
      await this.customLearningGoalRepository.findAllByLearningLanguageId(
        learningLanguageId,
      );

    if (!customLearningGoals) {
      throw new RessourceDoesNotExist();
    }

    return customLearningGoals;
  }
}
