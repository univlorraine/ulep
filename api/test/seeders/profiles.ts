import { faker } from '@faker-js/faker';
import { User } from '../../src/core/models/user';
import { Country } from '../../src/core/models/country';
import {
  Gender,
  Goal,
  MeetingFrequency,
  Profile,
  Role,
} from '../../src/core/models/profile';
import { University } from '../../src/core/models/university';

const seedDefinedUsersProfiles = (user: User[]): Profile[] => {
  const profile: Profile[] = [];

  const country = new Country({
    id: '1',
    name: 'United Kingdom',
    code: 'UK',
  });

  const university = new University({
    id: '1',
    name: 'University of Oxford',
    country,
    timezone: 'Europe/London',
    admissionStart: new Date('2020-01-01'),
    admissionEnd: new Date('2020-12-31'),
  });

  let i = user.length;

  while (i > 0) {
    const instance = new Profile({
      id: faker.string.uuid(),
      user: user[i - 1],
      firstname: 'Jane',
      lastname: 'Doe',
      age: 25,
      role: faker.helpers.arrayElement([Role.STUDENT, Role.TEACHER]),
      gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE]),
      university: university,
      nationality: country,
      nativeLanguage: {
        code: 'FR',
      },
      masteredLanguages: [],
      learningLanguage: {
        code: 'EN',
      },
      learningLanguageLevel: 'B2',
      goals: new Set([Goal.ORAL_PRACTICE]),
      interests: new Set(['music', 'sport']),
      preferences: {
        meetingFrequency: faker.helpers.arrayElement([
          MeetingFrequency.ONCE_A_WEEK,
          MeetingFrequency.TWICE_A_WEEK,
        ]),
        sameGender: faker.datatype.boolean(),
      },
      bios: 'Lorem ipsum dolor sit amet',
    });

    profile.push(instance);

    i--;
  }

  return profile;
};

export default seedDefinedUsersProfiles;
