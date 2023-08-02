import {
  ProficiencyLevel,
  ProficiencyTest,
  ProficiencyQuestion,
} from 'src/core/models';
import { ProficiencyRepository } from 'src/core/ports/proficiency.repository';

export class InMemoryProficiencyRepository implements ProficiencyRepository {
  #tests: ProficiencyTest[] = [];

  init(tests: ProficiencyTest[] = []): void {
    this.#tests = tests;
  }

  reset(): void {
    this.#tests = [];
  }

  async createTest(
    id: string,
    level: ProficiencyLevel,
  ): Promise<ProficiencyTest> {
    const test = new ProficiencyTest({ id, level, questions: [] });

    this.#tests.push(test);

    return test;
  }

  async findAllTests(): Promise<ProficiencyTest[]> {
    return this.#tests;
  }

  async testOfId(id: string): Promise<ProficiencyTest> {
    return this.#tests.find((test) => test.id === id);
  }

  async testOfLevel(level: ProficiencyLevel): Promise<ProficiencyTest> {
    return this.#tests.find((test) => test.level === level);
  }

  async removeTest(level: ProficiencyLevel): Promise<void> {
    const test = await this.testOfLevel(level);

    if (!test) {
      return;
    }

    this.#tests.splice(this.#tests.indexOf(test), 1);
  }

  async createQuestion(
    testId: string,
    question: ProficiencyQuestion,
  ): Promise<ProficiencyQuestion> {
    const index = this.#tests.findIndex((test) => test.id === testId);

    if (index === -1) {
      throw new Error('Proficiency test does not exist');
    }

    const test = this.#tests[index];

    test.questions.push(question);

    return question;
  }

  async questionOfId(id: string): Promise<ProficiencyQuestion> {
    return this.#tests
      .flatMap((test) => test.questions ?? [])
      .find((question) => question.id === id);
  }

  async updateQuestion(question: ProficiencyQuestion): Promise<void> {
    const index = this.#tests.findIndex((test) =>
      test.questions?.some((question) => question.id === question.id),
    );

    if (index === -1) {
      throw new Error('Proficiency test does not exist');
    }

    const test = this.#tests[index];

    const questionToUpdate = test.questions.find(
      (questionToUpdate) => questionToUpdate.id === question.id,
    );

    this.#tests[index] = new ProficiencyTest({
      id: test.id,
      level: test.level,
      questions: test.questions.map((question) =>
        question.id === questionToUpdate.id ? question : questionToUpdate,
      ),
    });
  }

  async removeQuestion(id: string): Promise<void> {
    const index = this.#tests.findIndex((test) =>
      test.questions?.some((question) => question.id === question.id),
    );

    if (index === -1) {
      throw new Error('Proficiency test does not exist');
    }

    const test = this.#tests[index];

    this.#tests[index] = new ProficiencyTest({
      id: test.id,
      level: test.level,
      questions: test.questions.filter((question) => question.id !== id),
    });
  }
}
