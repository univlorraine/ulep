import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { GetProfileUsecase } from '../../../src/core/usecases/profiles/get-profile.usecase';
import { UserFactory } from '../../factories/user.factory';
import { UniversityFactory } from '../../factories/university.factory';
import { LanguageFactory } from '../../factories/language.factory';
import { InterestFactory } from '../../factories/interest.factory';
import { LearningType, ProficiencyLevel, Profile } from 'src/core/models';

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

  const university = universityFactory.makeOne({
    languages: [learningLanguage, nativeLanguage],
  });

  const user = userFactory.makeOne({ university });

  const interest = interestFactory.makeOne();

  const profile = new Profile({
    id: 'uuid-1',
    user: user,
    languages: {
      native: nativeLanguage,
      learning: {
        ...learningLanguage,
        level: ProficiencyLevel.B2,
      },
      mastered: [],
    },
    preferences: {
      learningType: LearningType.ETANDEM,
      meetingFrequency: 'ONCE_A_WEEK',
      sameGender: false,
      sameAge: false,
      goals: [],
    },
    interests: [interest],
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
