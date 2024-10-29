import { Inject, Injectable } from '@nestjs/common';
import { DomainError, DomainErrorCode } from 'src/core/errors';
import {
  CustomLearningGoalRepository,
  CUSTOM_LEARNING_GOAL_REPOSITORY,
} from 'src/core/ports/custom-learning-goal.repository';

export class CreateCustomLearningGoalCommand {
  title: string;
  description: string;
  learningLanguageId: string;
}

@Injectable()
export class CreateCustomLearningGoalUsecase {
  constructor(
    @Inject(CUSTOM_LEARNING_GOAL_REPOSITORY)
    private readonly customLearningGoalRepository: CustomLearningGoalRepository,
  ) {}

  async execute(command: CreateCustomLearningGoalCommand) {
    const customLearningGoals =
      await this.customLearningGoalRepository.findAllByLearningLanguageId(
        command.learningLanguageId,
      );

    if (customLearningGoals.length > 3) {
      throw new DomainError({
        code: DomainErrorCode.BAD_REQUEST,
        message: 'You can only have 3 custom learning goals',
      });
    }

    const customLearningGoal = await this.customLearningGoalRepository.create({
      title: command.title,
      description: command.description,
      learningLanguageId: command.learningLanguageId,
    });

    customLearningGoals.push(customLearningGoal);

    return customLearningGoals;
  }
}
