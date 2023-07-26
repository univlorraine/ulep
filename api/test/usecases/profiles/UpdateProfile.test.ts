import { Gender, Profile, Role } from '../../../src/core/models/profile';
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { ProfileDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';
import { UpdateProfileUsecase } from '../../../src/core/usecases/profiles/update-profile.usecase';
import seedDefinedNumberOfUniversities from '../../seeders/universities';
import seedDefinedNumberOfUsers from '../../seeders/users';
import { CEFRLevel } from '../../../src/core/models/cefr';

describe('UpdateProfile', () => {
  const profileRepository = new InMemoryProfileRepository();
  const updateProfileUsecase = new UpdateProfileUsecase(profileRepository);

  const users = seedDefinedNumberOfUsers(10);

  const universities = seedDefinedNumberOfUniversities(
    10,
    (x: number) => `uuid-${x}`,
  );

  beforeEach(() => {
    profileRepository.reset();
  });

  it('should update a profile', async () => {
    const user = users[0];

    const instance = new Profile({
      id: 'uuid-1',
      user: user,
      role: Role.STUDENT,
      university: universities[0],
      personalInformation: {
        age: 25,
        gender: Gender.FEMALE,
        interests: ['music', 'sport'],
      },
      languages: {
        nativeLanguage: 'FR',
        masteredLanguages: [],
        learningLanguage: 'EN',
        learningLanguageLevel: CEFRLevel.B2,
      },
      preferences: {
        learningType: 'ETANDEM',
        meetingFrequency: 'TWICE_A_WEEK',
        sameGender: false,
        goals: ['ORAL_PRACTICE'],
      },
    });

    profileRepository.init([instance]);

    const profile = await updateProfileUsecase.execute({
      id: instance.id,
      proficiencyLevel: CEFRLevel.C1,
    });

    expect(profile.id).toEqual(profile.id);
    expect(profile.languages.learningLanguageLevel).toEqual('C1');
  });

  it('should throw an error if the profile does not exist', async () => {
    try {
      await updateProfileUsecase.execute({
        id: 'uuid-that-does-not-exist',
        proficiencyLevel: CEFRLevel.C1,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ProfileDoesNotExist);
    }
  });
});
