import { Country } from '../../../src/core/models/country';
import {
  Gender,
  Goal,
  MeetingFrequency,
  Role,
} from '../../../src/core/models/profile';
import { University } from '../../../src/core/models/university';
import { CreateProfileUsecase } from '../../../src/core/usecases/profiles/create-profile.usecase';
import { InMemoryCountryRepository } from '../../../src/providers/persistance/repositories/in-memory-country-repository';
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import {
  CountryDoesNotExist,
  UniversityDoesNotExist,
  UserDoesNotExist,
} from '../../../src/core/errors/RessourceDoesNotExist';
import { InMemoryUserRepository } from '../../../src/providers/persistance/repositories/in-memory-user-repository';
import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import seedDefinedNumberOfUsers from '../../seeders/users';
import { Language } from '../../../src/core/models/language';

describe('CreateProfile', () => {
  const userRepository = new InMemoryUserRepository();
  const profileRepository = new InMemoryProfileRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const countryRepository = new InMemoryCountryRepository();
  const languageRepository = new InMemoryLanguageRepository();
  const createProfileUsecase = new CreateProfileUsecase(
    profileRepository,
    userRepository,
    universityRepository,
    countryRepository,
    languageRepository,
  );

  const users = seedDefinedNumberOfUsers(1);

  const languages: Language[] = [
    new Language({
      name: 'English',
      code: 'EN',
      isEnable: true,
    }),
    new Language({
      name: 'French',
      code: 'FR',
      isEnable: true,
    }),
  ];

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

  beforeEach(async () => {
    userRepository.reset();
    profileRepository.reset();
    universityRepository.reset();
    countryRepository.reset();
    languageRepository.reset();

    userRepository.init(users);
    countryRepository.init([country]);
    universityRepository.init([university]);
    languageRepository.init(languages);
  });

  it('should create a profile', async () => {
    const user = users[0];

    const profile = await createProfileUsecase.execute({
      id: 'uuid-1',
      userId: user.id,
      firstname: 'Jane',
      lastname: 'Doe',
      age: 25,
      role: Role.STUDENT,
      gender: Gender.FEMALE,
      university: university.id,
      nationality: country.id,
      nativeLanguage: 'FR',
      learningLanguage: 'EN',
      proficiencyLevel: 'B2',
      goals: new Set([Goal.ORAL_PRACTICE]),
      interests: new Set(['music', 'sport']),
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      preferSameGender: true,
    });

    expect(profile).toBeDefined();
    expect(profile.id).toBe('uuid-1');
    expect(profile.user.email).toBe(user.email);
    expect(profile.firstname).toBe('Jane');
    expect(profile.lastname).toBe('Doe');
    expect(profile.age).toEqual(25);
    expect(profile.role).toBe('STUDENT');
  });

  it('should throw an error if the user does not exist', async () => {
    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        userId: 'uuid-that-does-not-exist',
        firstname: 'Jane',
        lastname: 'Doe',
        age: 25,
        role: Role.STUDENT,
        gender: Gender.FEMALE,
        university: university.id,
        nationality: country.id,
        nativeLanguage: 'FR',
        learningLanguage: 'EN',
        proficiencyLevel: 'B2',
        goals: new Set([Goal.ORAL_PRACTICE]),
        interests: new Set(['music', 'sport']),
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        preferSameGender: true,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UserDoesNotExist);
    }
  });

  it('should throw an error if the university does not exist', async () => {
    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        userId: users[0].id,
        firstname: 'Jane',
        lastname: 'Doe',
        age: 25,
        role: Role.STUDENT,
        gender: Gender.FEMALE,
        university: 'uuid-that-does-not-exist',
        nationality: country.id,
        nativeLanguage: 'FR',
        learningLanguage: 'EN',
        proficiencyLevel: 'B2',
        goals: new Set([Goal.ORAL_PRACTICE]),
        interests: new Set(['music', 'sport']),
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        preferSameGender: true,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UniversityDoesNotExist);
    }
  });

  it('should throw an error if the country does not exist', async () => {
    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        userId: users[0].id,
        firstname: 'Jane',
        lastname: 'Doe',
        age: 25,
        role: Role.STUDENT,
        gender: Gender.FEMALE,
        university: university.id,
        nationality: 'uuid-that-does-not-exist',
        nativeLanguage: 'FR',
        learningLanguage: 'EN',
        proficiencyLevel: 'B2',
        goals: new Set([Goal.ORAL_PRACTICE]),
        interests: new Set(['music', 'sport']),
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        preferSameGender: true,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CountryDoesNotExist);
    }
  });
});
