import { faker } from '@faker-js/faker';
import { ModelFactory } from './model.factory';
import { LearningObjective } from 'src/core/models';

export class LearningObjectiveFactory extends ModelFactory<LearningObjective> {
  getDefaults(): Partial<LearningObjective> {
    return {
      id: faker.string.uuid(),
      name: {
        id: faker.string.uuid(),
        content: faker.lorem.word(),
        language: 'en',
        translations: [],
      },
    };
  }
}
