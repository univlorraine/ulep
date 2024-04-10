import { faker } from '@faker-js/faker';
import {
  Profile,
  AvailabilitesOptions,
  MeetingFrequency,
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
      meetingFrequency: enumValue(MeetingFrequency),
      learningLanguages: [],
      objectives: [],
      interests: [],
      availabilities: {
        monday: enumValue(AvailabilitesOptions),
        tuesday: enumValue(AvailabilitesOptions),
        wednesday: enumValue(AvailabilitesOptions),
        thursday: enumValue(AvailabilitesOptions),
        friday: enumValue(AvailabilitesOptions),
        saturday: enumValue(AvailabilitesOptions),
        sunday: enumValue(AvailabilitesOptions),
      },
      availabilitiesNote: faker.lorem.sentence(),
      availabilitiesNotePrivacy: faker.datatype.boolean(),
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    };
  }
}
