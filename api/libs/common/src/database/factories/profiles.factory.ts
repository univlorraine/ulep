import { faker } from '@faker-js/faker';
import {
  LearningType,
  Profile,
  occurence,
} from '../../../../../src/core/models';
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
      availabilities: {
        monday: enumValue(occurence),
        tuesday: enumValue(occurence),
        wednesday: enumValue(occurence),
        thursday: enumValue(occurence),
        friday: enumValue(occurence),
        saturday: enumValue(occurence),
        sunday: enumValue(occurence),
      },
      availabilitiesNote: faker.lorem.sentence(),
      availavilitiesNotePrivacy: faker.datatype.boolean(),
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    };
  }
}
