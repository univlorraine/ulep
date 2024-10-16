import { CustomLearningGoal } from '../models';

export const CUSTOM_LEARNING_GOAL_REPOSITORY =
  'custom-learning-goal.repository';

export type CreateCustomLearningGoalProps = {
  title: string;
  description: string;
  learningLanguageId: string;
};

export type UpdateCustomLearningGoalProps = {
  id: string;
  title: string;
  description: string;
};

export interface CustomLearningGoalRepository {
  ofId: (id: string) => Promise<CustomLearningGoal | null>;

  create: (props: CreateCustomLearningGoalProps) => Promise<CustomLearningGoal>;

  update: (props: UpdateCustomLearningGoalProps) => Promise<CustomLearningGoal>;

  findAllByLearningLanguageId: (
    learningLanguageId: string,
  ) => Promise<CustomLearningGoal[]>;
}
