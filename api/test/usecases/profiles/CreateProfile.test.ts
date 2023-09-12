import {
  InterestFactory,
  LanguageFactory,
  UniversityFactory,
  UserFactory,
} from '@app/common';
import { CreateProfileUsecase } from '../../../src/core/usecases';
import { InMemoryInterestRepository } from '../../../src/providers/persistance/repositories/in-memory-interest.repository';
import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { InMemoryUserRepository } from '../../../src/providers/persistance/repositories/in-memory-user-repository';
import { LearningType, ProficiencyLevel } from '../../../src/core/models';
import {
  RessourceDoesNotExist,
  UnsuportedLanguageException,
} from 'src/core/errors';
import { ProfileLanguagesException } from 'src/core/errors/profile-exceptions';

describe('CreateProfile', () => {
  const userFactory = new UserFactory();
  const universityFactory = new UniversityFactory();
  const languageFactory = new LanguageFactory();
  const interestFactory = new InterestFactory();

  const userRepository = new InMemoryUserRepository();
  const profileRepository = new InMemoryProfileRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const languageRepository = new InMemoryLanguageRepository();
  const interestRepository = new InMemoryInterestRepository();

  const learningLanguage = languageFactory.makeOne({
    id: 'uuid-1',
    code: 'en',
  });

  const nativeLanguage = languageFactory.makeOne({
    id: 'uuid-2',
    code: 'fr',
  });

  const masteredLanguage = languageFactory.makeOne({
    id: 'uuid-3',
    code: 'de',
  });

  const unvailableLanguage = languageFactory.makeOne({
    id: 'uuid-4',
    code: 'es',
  });

  const languages = [learningLanguage, nativeLanguage, masteredLanguage];

  const university = universityFactory.makeOne({ languages });

  const user = userFactory.makeOne({
    university: university,
  });

  const interest = interestFactory.makeOne();

  const createProfileUsecase = new CreateProfileUsecase(
    userRepository,
    profileRepository,
    languageRepository,
    interestRepository,
  );

  beforeEach(async () => {
    userRepository.reset();
    profileRepository.reset();
    universityRepository.reset();
    languageRepository.reset();

    userRepository.init([user]);
    interestRepository.init([interest]);
    languageRepository.init([...languages, unvailableLanguage]);
  });

  // it('should create a profile', async () => {
  //   const profile = await createProfileUsecase.execute({
  //     id: 'uuid-1',
  //     user: user.id,
  //     nativeLanguageCode: nativeLanguage.code,
  //     learningLanguageCode: learningLanguage.code,
  //     masteredLanguageCodes: [masteredLanguage.code],
  //     proficiencyLevel: ProficiencyLevel.B2,
  //     learningType: LearningType.ETANDEM,
  //     goals: [],
  //     meetingFrequency: 'ONCE_A_WEEK',
  //     interests: [interest.id],
  //     sameGender: true,
  //     sameAge: true,
  //     bios: 'I am a student',
  //   });

  //   expect(profile).toBeDefined();
  //   expect(profile.id).toBe('uuid-1');
  // });

  it('should throw an error if the user does not exist', async () => {
    let exception: Error | undefined;

    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        user: 'uuid-that-does-not-exist',
        nativeLanguageCode: languages[0].code,
        learningLanguageCode: languages[1].code,
        level: ProficiencyLevel.B2,
        learningType: LearningType.ETANDEM,
        objectives: [],
        meetingFrequency: 'ONCE_A_WEEK',
        interests: [interest.id],
        sameGender: true,
        sameAge: true,
        bios: 'I am a student',
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(RessourceDoesNotExist);
  });

  it('when learning language is null, level should be A0', async () => {
    const profile = await createProfileUsecase.execute({
      id: 'uuid-1',
      user: user.id,
      nativeLanguageCode: nativeLanguage.code,
      level: ProficiencyLevel.B2,
      learningType: LearningType.ETANDEM,
      objectives: [],
      meetingFrequency: 'ONCE_A_WEEK',
      interests: [interest.id],
      sameGender: true,
      sameAge: true,
      bios: 'I am a student',
    });

    expect(profile.level).toBe(ProficiencyLevel.A0);
  });

  it('should throw an error if university do not accept learning language', async () => {
    let exception: Error | undefined;

    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        user: user.id,
        nativeLanguageCode: nativeLanguage.code,
        learningLanguageCode: unvailableLanguage.code,
        level: ProficiencyLevel.B2,
        learningType: LearningType.ETANDEM,
        objectives: [],
        meetingFrequency: 'ONCE_A_WEEK',
        interests: [interest.id],
        sameGender: true,
        sameAge: true,
        bios: 'I am a student',
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(UnsuportedLanguageException);
  });

  it('should throw an error if learningLanguage and nativeLanguage are equals', async () => {
    let exception: Error | undefined;

    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        user: user.id,
        nativeLanguageCode: nativeLanguage.code,
        learningLanguageCode: nativeLanguage.code,
        level: ProficiencyLevel.B2,
        learningType: LearningType.ETANDEM,
        objectives: [],
        meetingFrequency: 'ONCE_A_WEEK',
        interests: [interest.id],
        sameGender: true,
        sameAge: true,
        bios: 'I am a student',
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
        user: user.id,
        nativeLanguageCode: nativeLanguage.code,
        learningLanguageCode: learningLanguage.code,
        level: ProficiencyLevel.B2,
        masteredLanguageCodes: [nativeLanguage.code],
        learningType: LearningType.ETANDEM,
        objectives: [],
        meetingFrequency: 'ONCE_A_WEEK',
        interests: [interest.id],
        sameGender: true,
        sameAge: true,
        bios: 'I am a student',
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(ProfileLanguagesException);
  });

  it('should throw an error if mastered languages contains learning language', async () => {
    let exception: Error | undefined;

    try {
      await createProfileUsecase.execute({
        id: 'uuid-1',
        user: user.id,
        nativeLanguageCode: nativeLanguage.code,
        learningLanguageCode: learningLanguage.code,
        level: ProficiencyLevel.B2,
        masteredLanguageCodes: [learningLanguage.code],
        learningType: LearningType.ETANDEM,
        objectives: [],
        meetingFrequency: 'ONCE_A_WEEK',
        interests: [interest.id],
        sameGender: true,
        sameAge: true,
        bios: 'I am a student',
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(ProfileLanguagesException);
  });
});
