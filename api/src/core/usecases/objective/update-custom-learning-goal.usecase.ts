import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  CustomLearningGoalRepository,
  CUSTOM_LEARNING_GOAL_REPOSITORY,
} from 'src/core/ports/custom-learning-goal.repository';

export class UpdateCustomLearningGoalCommand {
  title: string;
  description: string;
}

@Injectable()
export class UpdateCustomLearningGoalUsecase {
  constructor(
    @Inject(CUSTOM_LEARNING_GOAL_REPOSITORY)
    private readonly customLearningGoalRepository: CustomLearningGoalRepository,
  ) {}

  async execute(id: string, command: UpdateCustomLearningGoalCommand) {
    const instance = await this.customLearningGoalRepository.ofId(id);

    if (!instance) {
      throw new RessourceDoesNotExist();
    }

    const customLearningGoal = await this.customLearningGoalRepository.update({
      id: id,
      title: command.title,
      description: command.description,
    });

    const customLearningGoals =
      await this.customLearningGoalRepository.findAllByLearningLanguageId(
        customLearningGoal.learningLanguageId,
      );

    return customLearningGoals;
  }
}
