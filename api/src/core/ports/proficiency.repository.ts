import { Collection } from '@app/common';
import {
  ProficiencyLevel,
  ProficiencyQuestion,
  ProficiencyTest,
} from '../models';

export const PROFICIENCY_REPOSITORY = 'proficiency.repository';

export interface ProficiencyRepository {
  createTest(id: string, level: ProficiencyLevel): Promise<ProficiencyTest>;

  findAllTests(): Promise<ProficiencyTest[]>;

  testOfId(id: string): Promise<ProficiencyTest | null>;

  testOfLevel(level: ProficiencyLevel): Promise<ProficiencyTest | null>;

  removeTest(level: ProficiencyLevel): Promise<void>;

  findAllQuestions(
    offset?: number,
    limit?: number,
    where?: ProficiencyLevel,
  ): Promise<Collection<ProficiencyQuestion>>;

  createQuestion(
    testId: string,
    question: ProficiencyQuestion,
  ): Promise<ProficiencyQuestion>;

  questionOfId(id: string): Promise<ProficiencyQuestion | null>;

  updateQuestion(question: ProficiencyQuestion): Promise<ProficiencyQuestion>;

  removeQuestion(id: string): Promise<void>;
}
