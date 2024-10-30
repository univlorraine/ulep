import * as Prisma from '@prisma/client';
import { CustomLearningGoal } from 'src/core/models';
import { LearningLanguageSnapshot } from './learningLanguage.mapper';

export type CustomLearningGoalSnapshot = Prisma.CustomLearningGoals & {
  LearningLanguage: LearningLanguageSnapshot;
};

export const customLearningGoalMapper = (
  instance: Prisma.CustomLearningGoals,
): CustomLearningGoal => {
  return new CustomLearningGoal({
    id: instance.id,
    learningLanguageId: instance.learning_language_id,
    title: instance.title,
    description: instance.description,
  });
};
