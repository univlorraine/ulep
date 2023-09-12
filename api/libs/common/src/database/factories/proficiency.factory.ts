import { faker } from '@faker-js/faker';
import {
  ProficiencyLevel,
  ProficiencyQuestion,
  ProficiencyTest,
} from '../../../../../src/core/models';
import { ModelFactory } from './model.factory';

export class ProficiencyTestFactory extends ModelFactory<ProficiencyTest> {
  getDefaults(): Partial<ProficiencyTest> {
    return {
      id: faker.string.uuid(),
      level: faker.helpers.arrayElement(
        Object.values(ProficiencyLevel),
      ) as ProficiencyLevel,
      questions: [],
    };
  }
}

export class ProficiencyQuestionFactory extends ModelFactory<ProficiencyQuestion> {
  getDefaults(): Partial<ProficiencyQuestion> {
    return {
      id: faker.string.uuid(),
      text: {
        id: faker.string.uuid(),
        content: faker.lorem.sentence(),
        language: 'en',
      },
      answer: faker.datatype.boolean(),
    };
  }
}
