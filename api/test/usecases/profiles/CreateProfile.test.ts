import { Gender, Role } from '../../../src/core/models/profile';
import { University } from '../../../src/core/models/university';
import { CreateProfileUsecase } from '../../../src/core/usecases/profiles/create-profile.usecase';
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import {
  LanguageDoesNotExist,
  UniversityDoesNotExist,
  UserDoesNotExist,
} from '../../../src/core/errors/RessourceDoesNotExist';
import { InMemoryUserRepository } from '../../../src/providers/persistance/repositories/in-memory-user-repository';
import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import seedDefinedNumberOfUsers from '../../seeders/users';
import { Language } from '../../../src/core/models/language';
import { ProfileLanguagesException } from '../../../src/core/errors/ProfileExceptions';
import { CEFRLevel } from '../../../src/core/models/cefr';

describe('CreateProfile', () => {
  const userRepository = new InMemoryUserRepository();
  const profileRepository = new InMemoryProfileRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const languageRepository = new InMemoryLanguageRepository();
  const createProfileUsecase = new CreateProfileUsecase(
    profileRepository,
    userRepository,
    universityRepository,
    languageRepository,
  );

  const users = seedDefinedNumberOfUsers(1);

  const languages: Language[] = [
    { name: 'English', code: 'EN' },
    { name: 'French', code: 'FR' },
    { name: 'Japanese', code: 'JA' },
  ];

  const university = new University({
    id: 'uuid-1',
    name: 'University of Oxford',
    campus: ['Oxford'],
    website: 'https://ox.ac.uk',
    languages: [
      { name: 'English', code: 'EN' },
      { name: 'French', code: 'FR' },
    ],
    timezone: 'Europe/London',
    admissionStart: new Date('2020-01-01'),
    admissionEnd: new Date('2020-12-31'),
  });

  beforeEach(async () => {
    userRepository.reset();
    profileRepository.reset();
    universityRepository.reset();
    languageRepository.reset();

    userRepository.init(users);
    universityRepository.init([university]);
    languageRepository.init(languages);
  });

  it('should create a profile', async () => {
    const user = users[0];

    const profile = await createProfileUsecase.execute({
      id: 'uuid-1',
      userId: user.id,
      age: 25,
      role: Role.STUDENT,
      gender: Gender.FEMALE,
      university: university.id,
      nativeLanguage: 'FR',
      learningLanguage: 'EN',
      proficiencyLevel: CEFRLevel.B2,
      learningType: 'ETANDEM',
      goals: ['ORAL_PRACTICE'],
      interests: ['music', 'sport'],
      meetingFrequency: 'ONCE_A_WEEK',
      preferSameGender: true,
    });

    expect(profile).toBeDefined();
    expect(profile.id).toBe('uuid-1');
  });

  it('should throw an error if the user does not exist', async () => {
    let exception: Error | null = null;

    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        userId: 'uuid-that-does-not-exist',
        age: 25,
        role: Role.STUDENT,
        gender: Gender.FEMALE,
        university: university.id,
        nativeLanguage: 'FR',
        learningLanguage: 'EN',
        proficiencyLevel: CEFRLevel.B2,
        learningType: 'ETANDEM',
        goals: ['ORAL_PRACTICE'],
        interests: ['music', 'sport'],
        meetingFrequency: 'ONCE_A_WEEK',
        preferSameGender: true,
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(UserDoesNotExist);
  });

  it('should throw an error if the university does not exist', async () => {
    let exception: Error | null = null;

    try {
      const user = users[0];

      await createProfileUsecase.execute({
        id: 'uuid-1',
        userId: user.id,
        age: 25,
        role: Role.STUDENT,
        gender: Gender.FEMALE,
        university: 'uuid-that-does-not-exist',
        nativeLanguage: 'FR',
        learningLanguage: 'EN',
        proficiencyLevel: CEFRLevel.B2,
        learningType: 'ETANDEM',
        goals: ['ORAL_PRACTICE'],
        interests: ['music', 'sport'],
        meetingFrequency: 'ONCE_A_WEEK',
        preferSameGender: true,
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(UniversityDoesNotExist);
  });

  it('should throw an error if the language is not available', async () => {
    let exception: Error | null = null;

    try {
      const user = users[0];

      await createProfileUsecase.execute({
        id: 'uuid-1',
        userId: user.id,
        age: 25,
        role: Role.STUDENT,
        gender: Gender.FEMALE,
        university: university.id,
        nativeLanguage: 'FR',
        learningLanguage: 'ZH',
        proficiencyLevel: CEFRLevel.B2,
        learningType: 'ETANDEM',
        goals: ['ORAL_PRACTICE'],
        interests: ['music', 'sport'],
        meetingFrequency: 'ONCE_A_WEEK',
        preferSameGender: true,
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(LanguageDoesNotExist);
  });

  it('when learning language is null, level should be A0', async () => {
    const profile = await createProfileUsecase.execute({
      id: 'uuid-1',
      userId: users[0].id,
      age: 25,
      role: Role.STUDENT,
      gender: Gender.FEMALE,
      university: university.id,
      nativeLanguage: 'FR',
      proficiencyLevel: CEFRLevel.B2,
      learningType: 'ETANDEM',
      goals: ['ORAL_PRACTICE'],
      interests: ['music', 'sport'],
      meetingFrequency: 'ONCE_A_WEEK',
      preferSameGender: true,
    });

    expect(profile.languages.learningLanguageLevel).toBe('A0');
  });

  it('should throw an error if university do not accept learning language', async () => {
    let exception: Error | null = null;

    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        userId: users[0].id,
        age: 25,
        role: Role.STUDENT,
        gender: Gender.FEMALE,
        university: university.id,
        nativeLanguage: 'FR',
        learningLanguage: 'JA',
        proficiencyLevel: CEFRLevel.B2,
        learningType: 'ETANDEM',
        goals: ['ORAL_PRACTICE'],
        interests: ['music', 'sport'],
        meetingFrequency: 'ONCE_A_WEEK',
        preferSameGender: true,
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(ProfileLanguagesException);
  });

  it('should throw an error if learningLanguage and nativeLanguage are equals', async () => {
    let exception: Error | null = null;

    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        userId: users[0].id,
        age: 25,
        role: Role.STUDENT,
        gender: Gender.FEMALE,
        university: university.id,
        nativeLanguage: 'FR',
        learningLanguage: 'FR',
        proficiencyLevel: CEFRLevel.B2,
        learningType: 'ETANDEM',
        goals: ['ORAL_PRACTICE'],
        interests: ['music', 'sport'],
        meetingFrequency: 'ONCE_A_WEEK',
        preferSameGender: true,
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(ProfileLanguagesException);
  });

  it('should throw an error if mastered languages contains native language', async () => {
    let exception: Error | null = null;

    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        userId: users[0].id,
        age: 25,
        role: Role.STUDENT,
        gender: Gender.FEMALE,
        university: university.id,
        nativeLanguage: 'FR',
        learningLanguage: 'EN',
        masteredLanguages: ['FR'],
        proficiencyLevel: CEFRLevel.B2,
        learningType: 'ETANDEM',
        goals: ['ORAL_PRACTICE'],
        interests: ['music', 'sport'],
        meetingFrequency: 'ONCE_A_WEEK',
        preferSameGender: true,
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(ProfileLanguagesException);
  });

  it('should throw an error if mastered languages contains learning language', async () => {
    let exception: Error | null = null;

    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        userId: users[0].id,
        age: 25,
        role: Role.STUDENT,
        gender: Gender.FEMALE,
        university: university.id,
        nativeLanguage: 'FR',
        learningLanguage: 'EN',
        masteredLanguages: ['EN'],
        proficiencyLevel: CEFRLevel.B2,
        learningType: 'ETANDEM',
        goals: ['ORAL_PRACTICE'],
        interests: ['music', 'sport'],
        meetingFrequency: 'ONCE_A_WEEK',
        preferSameGender: true,
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(ProfileLanguagesException);
  });
});
