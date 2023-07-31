import { faker } from '@faker-js/faker';
import { Gender, Role, User } from '../../src/core/models';
import { ModelFactory } from './model.factory';

const enumValue = <T>(_enum: unknown): T => {
  const entries = Object.entries(_enum).map(([, v]) => v.toUpperCase());
  return faker.helpers.arrayElement(entries) as T;
};

export class UserFactory extends ModelFactory<User> {
  getDefaults(): Partial<User> {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      gender: enumValue(Gender),
      age: faker.number.int({ min: 16, max: 64 }),
      role: enumValue(Role),
      country: 'FR',
    };
  }
}
