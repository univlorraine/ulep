import seedDefinedNumberOfProfiles from '../../seeders/profiles';
import { Country } from '../../../src/core/models/country';
import { Goal, MeetingFrequency } from '../../../src/core/models/profile';
import { University } from '../../../src/core/models/university';
import { CreateProfileUsecase } from '../../../src/core/usecases/profiles/create-profile.usecase';
import { InMemoryCountryRepository } from '../../../src/providers/persistance/repositories/in-memory-country-repository';
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { ProfileAlreadyExists } from '../../../src/core/errors/RessourceAlreadyExists';
import {
  CountryDoesNotExist,
  UniversityDoesNotExist,
} from '../../../src/core/errors/RessourceDoesNotExist';

describe('CreateProfile', () => {
  const profileRepository = new InMemoryProfileRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const countryRepository = new InMemoryCountryRepository();
  const createProfileUsecase = new CreateProfileUsecase(
    profileRepository,
    universityRepository,
    countryRepository,
  );

  const country = new Country({
    id: 'uuid-1',
    name: 'United Kingdom',
    code: 'UK',
  });

  const university = new University({
    id: 'uuid-1',
    name: 'University of Oxford',
    country,
    timezone: 'Europe/London',
    admissionStart: new Date('2020-01-01'),
    admissionEnd: new Date('2020-12-31'),
  });

  beforeEach(() => {
    profileRepository.reset();
    universityRepository.reset();
    countryRepository.reset();
    countryRepository.init([country]);
    universityRepository.init([university]);
  });

  it('should create a profile', async () => {
    const profile = await createProfileUsecase.execute({
      id: 'uuid-1',
      email: 'jane.doe@mail.com',
      firstname: 'Jane',
      lastname: 'Doe',
      birthdate: new Date('1988-01-01'),
      role: 'STUDENT',
      gender: 'FEMALE',
      university: university.id,
      nationality: country.id,
      goals: [Goal.ORAL_PRACTICE],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      bios: 'Lorem ipsum dolor sit amet',
    });

    expect(profile).toBeDefined();
    expect(profile.id).toBe('uuid-1');
    expect(profile.email).toBe('jane.doe@mail.com');
    expect(profile.firstname).toBe('Jane');
    expect(profile.lastname).toBe('Doe');
    expect(profile.birthdate).toEqual(new Date('1988-01-01'));
    expect(profile.role).toBe('STUDENT');
    expect(profile.meetingFrequency).toBe('ONCE_A_WEEK');
    expect(profile.bios).toBe('Lorem ipsum dolor sit amet');
  });

  it('should throw an error if the profile already exists', async () => {
    profileRepository.init(seedDefinedNumberOfProfiles(1));

    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        email: 'jane.doe@mail.com',
        firstname: 'Jane',
        lastname: 'Doe',
        birthdate: new Date('1988-01-01'),
        role: 'STUDENT',
        gender: 'FEMALE',
        university: university.id,
        nationality: country.id,
        goals: [Goal.ORAL_PRACTICE],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        bios: 'Lorem ipsum dolor sit amet',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ProfileAlreadyExists);
    }
  });

  it('should throw an error if the university does not exist', async () => {
    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        email: 'jane.doe@mail.com',
        firstname: 'Jane',
        lastname: 'Doe',
        birthdate: new Date('1988-01-01'),
        role: 'STUDENT',
        gender: 'FEMALE',
        university: 'uuid-that-does-not-exist',
        nationality: country.id,
        goals: [Goal.ORAL_PRACTICE],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        bios: 'Lorem ipsum dolor sit amet',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UniversityDoesNotExist);
    }
  });

  it('should throw an error if the country does not exist', async () => {
    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        email: 'jane.doe@mail.com',
        firstname: 'Jane',
        lastname: 'Doe',
        birthdate: new Date('1988-01-01'),
        role: 'STUDENT',
        gender: 'FEMALE',
        university: university.id,
        nationality: 'uuid-that-does-not-exist',
        goals: [Goal.ORAL_PRACTICE],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        bios: 'Lorem ipsum dolor sit amet',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CountryDoesNotExist);
    }
  });
});
