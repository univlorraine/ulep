import { LearningObjective } from '../models';

export const OBJECTIVE_REPOSITORY = 'objective.repository';

export interface LearningObjectiveRepository {
  create(instance: LearningObjective): Promise<LearningObjective>;

  ofId(id: string): Promise<LearningObjective | null>;

  all(): Promise<LearningObjective[]>;

  delete(id: string): Promise<void>;
}
