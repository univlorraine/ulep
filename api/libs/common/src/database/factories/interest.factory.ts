import { faker } from '@faker-js/faker';
import { Interest, InterestCategory } from '../../../../../src/core/models';
import { ModelFactory } from './model.factory';

export class InterestFactory extends ModelFactory<Interest> {
  getDefaults(): Partial<Interest> {
    return {
      id: faker.string.uuid(),
      name: {
        id: faker.string.uuid(),
        content: faker.lorem.sentence(),
        language: 'en',
      },
    };
  }
}

export class InterestCategoryFactory extends ModelFactory<InterestCategory> {
  getDefaults(): Partial<InterestCategory> {
    return {
      id: faker.string.uuid(),
      name: {
        id: faker.string.uuid(),
        content: faker.lorem.sentence(),
        language: 'en',
      },
    };
  }
}
