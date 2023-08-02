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

  createQuestion(
    testId: string,
    question: ProficiencyQuestion,
  ): Promise<ProficiencyQuestion>;

  questionOfId(id: string): Promise<ProficiencyQuestion | null>;

  updateQuestion(question: ProficiencyQuestion): Promise<void>;

  removeQuestion(id: string): Promise<void>;
}
