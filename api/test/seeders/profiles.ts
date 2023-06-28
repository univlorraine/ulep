import { Country } from '../../src/core/models/country';
import { Goal, MeetingFrequency, Profile } from '../../src/core/models/profile';
import { University } from '../../src/core/models/university';

const seedDefinedNumberOfProfiles = (
  count: number,
  id: (index: number) => string = (index: number) => `${index}`,
): Profile[] => {
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

  let i = count;

  while (i > 0) {
    const instance = new Profile({
      id: id(i),
      email: 'jane.doe@mail.com',
      firstname: 'Jane',
      lastname: 'Doe',
      birthdate: new Date('1988-01-01'),
      role: 'STUDENT',
      gender: 'FEMALE',
      university: university,
      nationality: country,
      goals: [Goal.ORAL_PRACTICE],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      bios: 'Lorem ipsum dolor sit amet',
    });

    profile.push(instance);

    i--;
  }

  return profile;
};

export default seedDefinedNumberOfProfiles;
