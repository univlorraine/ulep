import { faker } from '@faker-js/faker';
import { LearningType, Profile } from '../../../../../src/core/models';
import { ModelFactory } from './model.factory';

const enumValue = <T>(_enum: unknown): T => {
  const entries = Object.entries(_enum).map(([, v]) => v.toUpperCase());
  return faker.helpers.arrayElement(entries) as T;
};

export class ProfileFactory extends ModelFactory<Profile> {
  getDefaults(): Partial<Profile> {
    return {
      id: faker.string.uuid(),
      masteredLanguages: [],
      learningType: enumValue(LearningType),
      meetingFrequency: faker.helpers.arrayElement([
        'ONCE_A_WEEK',
        'TWICE_A_WEEK',
      ]),
      learningLanguages: [],
      sameGender: faker.datatype.boolean(),
      sameAge: faker.datatype.boolean(),
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    };
  }
}
