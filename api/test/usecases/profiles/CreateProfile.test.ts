import { Country } from '../../../src/core/models/country';
import {
  Goal,
  LanguageLevel,
  MeetingFrequency,
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
      id: 'uuid-1',
      name: 'English',
      code: 'EN',
      isEnable: true,
    }),
    new Language({
      id: 'uuid-2',
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
      birthdate: new Date('1988-01-01'),
      role: 'STUDENT',
      gender: 'FEMALE',
      university: university.id,
      nationality: country.id,
      learningLanguage: 'EN',
      proficiencyLevel: LanguageLevel.B2,
      nativeLanguage: 'FR',
      goals: [Goal.ORAL_PRACTICE],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      bios: 'Lorem ipsum dolor sit amet',
    });

    expect(profile).toBeDefined();
    expect(profile.id).toBe('uuid-1');
    expect(profile.user.email).toBe(user.email);
    expect(profile.firstname).toBe('Jane');
    expect(profile.lastname).toBe('Doe');
    expect(profile.birthdate).toEqual(new Date('1988-01-01'));
    expect(profile.role).toBe('STUDENT');
    expect(profile.meetingFrequency).toBe('ONCE_A_WEEK');
    expect(profile.bios).toBe('Lorem ipsum dolor sit amet');
  });

  // it('should throw an error if the profile already exists', async () => {
  //   profileRepository.init(seedDefinedUsersProfiles(users));

  //   try {
  //     await createProfileUsecase.execute({
  //       id: 'uuid-1',
  //       userId: users[0].id,
  //       firstname: 'Jane',
  //       lastname: 'Doe',
  //       birthdate: new Date('1988-01-01'),
  //       role: 'STUDENT',
  //       gender: 'FEMALE',
  //       university: university.id,
  //       nationality: country.id,
  //       learningLanguage: 'EN',
  //       proficiencyLevel: LanguageLevel.B2,
  //       nativeLanguage: 'FR',
  //       goals: [Goal.ORAL_PRACTICE],
  //       meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
  //       bios: 'Lorem ipsum dolor sit amet',
  //     });
  //   } catch (error) {
  //     expect(error).toBeInstanceOf(ProfileAlreadyExists);
  //   }
  // });

  it('should throw an error if the user does not exist', async () => {
    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        userId: 'uuid-that-does-not-exist',
        firstname: 'Jane',
        lastname: 'Doe',
        birthdate: new Date('1988-01-01'),
        role: 'STUDENT',
        gender: 'FEMALE',
        university: university.id,
        nationality: country.id,
        nativeLanguage: 'FR',
        learningLanguage: 'EN',
        proficiencyLevel: LanguageLevel.B2,
        goals: [Goal.ORAL_PRACTICE],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        bios: 'Lorem ipsum dolor sit amet',
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
        birthdate: new Date('1988-01-01'),
        role: 'STUDENT',
        gender: 'FEMALE',
        university: 'uuid-that-does-not-exist',
        nationality: country.id,
        nativeLanguage: 'FR',
        learningLanguage: 'EN',
        proficiencyLevel: LanguageLevel.B2,
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
        userId: users[0].id,
        firstname: 'Jane',
        lastname: 'Doe',
        birthdate: new Date('1988-01-01'),
        role: 'STUDENT',
        gender: 'FEMALE',
        university: university.id,
        nationality: 'uuid-that-does-not-exist',
        nativeLanguage: 'FR',
        learningLanguage: 'EN',
        proficiencyLevel: LanguageLevel.B2,
        goals: [Goal.ORAL_PRACTICE],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        bios: 'Lorem ipsum dolor sit amet',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CountryDoesNotExist);
    }
  });
});
