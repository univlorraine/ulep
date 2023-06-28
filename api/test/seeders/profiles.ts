import { faker } from '@faker-js/faker';
import { User } from '../../src/core/models/user';
import { Country } from '../../src/core/models/country';
import {
  Goal,
  LanguageLevel,
  MeetingFrequency,
  Profile,
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
      birthdate: new Date('1988-01-01'),
      role: 'STUDENT',
      gender: 'FEMALE',
      university: university,
      nationality: country,
      nativeLanguage: {
        id: '1',
        code: 'EN',
      },
      learningLanguage: {
        id: '2',
        code: 'FR',
        proficiencyLevel: LanguageLevel.B2,
      },
      goals: [Goal.ORAL_PRACTICE],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      bios: 'Lorem ipsum dolor sit amet',
    });

    profile.push(instance);

    i--;
  }

  return profile;
};

export default seedDefinedUsersProfiles;
