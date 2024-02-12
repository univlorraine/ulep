import {
  InterestFactory,
  LanguageFactory,
  UniversityFactory,
  UserFactory,
} from '@app/common';
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { GetProfileUsecase } from '../../../src/core/usecases/profiles/get-profile.usecase';
import {
  AvailabilitesOptions,
  LearningLanguage,
  LearningType,
  MeetingFrequency,
  ProficiencyLevel,
  Profile,
} from 'src/core/models';

describe('GetProfile', () => {
  const userFactory = new UserFactory();
  const universityFactory = new UniversityFactory();
  const languageFactory = new LanguageFactory();
  const interestFactory = new InterestFactory();

  const profileRepository = new InMemoryProfileRepository();
  const getProfileUsecase = new GetProfileUsecase(profileRepository);

  const learningLanguage = languageFactory.makeOne({
    id: 'uuid-1',
    code: 'en',
  });

  const nativeLanguage = languageFactory.makeOne({
    id: 'uuid-2',
    code: 'fr',
  });

  const university = universityFactory.makeOne();

  const user = userFactory.makeOne({ university });

  const interest = interestFactory.makeOne();

  const profile = new Profile({
    id: 'uuid-1',
    user: user,
    nativeLanguage: nativeLanguage,
    masteredLanguages: [],
    learningLanguages: [
      new LearningLanguage({
        id: 'learning-language-uuid-1',
        language: learningLanguage,
        level: ProficiencyLevel.B2,
        learningType: LearningType.ETANDEM,
        sameGender: false,
        sameAge: false,
      }),
    ],
    meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
    objectives: [],
    interests: [interest],
    availabilities: {
      monday: AvailabilitesOptions.AVAILABLE,
      tuesday: AvailabilitesOptions.AVAILABLE,
      wednesday: AvailabilitesOptions.AVAILABLE,
      thursday: AvailabilitesOptions.AVAILABLE,
      friday: AvailabilitesOptions.AVAILABLE,
      saturday: AvailabilitesOptions.AVAILABLE,
      sunday: AvailabilitesOptions.AVAILABLE,
    },
  });

  beforeEach(() => {
    profileRepository.reset();
  });

  it('should get a profile', async () => {
    profileRepository.init([profile]);

    const instance = await getProfileUsecase.execute({
      id: profile.id,
    });

    expect(instance).toBeDefined();
  });

  it('should throw an error if profile does not exist', async () => {
    let exception: Error | undefined;

    try {
      await getProfileUsecase.execute({
        id: 'uuid-that-does-not-exist',
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeDefined();
  });
});
