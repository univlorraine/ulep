import { faker } from '@faker-js/faker';
import { User } from '../../src/core/models/user';
import { Gender, Profile, Role } from '../../src/core/models/profile';
import { University } from '../../src/core/models/university';

const seedDefinedUsersProfiles = (user: User[]): Profile[] => {
  const profile: Profile[] = [];

  const university = new University({
    id: '1',
    name: 'Université de Lorraine',
    website: 'https://univ-lorraine.fr',
    campus: ['Nancy', 'Metz'],
    languages: [
      { name: 'French', code: 'FR' },
      { name: 'English', code: 'EN' },
    ],
    timezone: 'Europe/Paris',
    admissionStart: new Date('2020-01-01'),
    admissionEnd: new Date('2020-12-31'),
  });

  let i = user.length;

  while (i > 0) {
    const instance = new Profile({
      id: faker.string.uuid(),
      user: user[i - 1],
      role: faker.helpers.arrayElement([Role.STUDENT, Role.TEACHER]),
      university: university,
      languages: {
        nativeLanguage: 'FR',
        masteredLanguages: ['ES'],
        learningLanguage: 'EN',
        learningLanguageLevel: 'B2',
      },
      personalInformation: {
        age: 25,
        gender: faker.helpers.arrayElement([
          Gender.MALE,
          Gender.FEMALE,
          Gender.OTHER,
        ]),
        interests: ['music', 'sport'],
        bio: 'Lorem ipsum dolor sit amet',
      },
      preferences: {
        learningType: 'ETANDEM',
        meetingFrequency: faker.helpers.arrayElement([
          'ONCE_A_WEEK',
          'TWICE_A_WEEK',
        ]),
        sameGender: faker.datatype.boolean(),
        goals: ['ORAL_PRACTICE'],
      },
    });

    profile.push(instance);

    i--;
  }

  return profile;
};

export default seedDefinedUsersProfiles;
