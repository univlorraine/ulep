import {
  Gender,
  Goal,
  MeetingFrequency,
  Profile,
  Role,
} from '../../../src/core/models/profile';
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import {
  ProfileDoesNotExist,
  UniversityDoesNotExist,
} from '../../../src/core/errors/RessourceDoesNotExist';
import { UpdateProfileUsecase } from '../../../src/core/usecases/profiles/update-profile.usecase';
import seedDefinedNumberOfUniversities from '../../seeders/universities';
import seedDefinedNumberOfUsers from '../../seeders/users';
import seedDefinedUsersProfiles from '../../seeders/profiles';

describe('UpdateProfile', () => {
  const profileRepository = new InMemoryProfileRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const updateProfileUsecase = new UpdateProfileUsecase(
    profileRepository,
    universityRepository,
  );

  const users = seedDefinedNumberOfUsers(10);

  const universities = seedDefinedNumberOfUniversities(
    10,
    (x: number) => `uuid-${x}`,
  );

  beforeEach(() => {
    profileRepository.reset();
    universityRepository.reset();
    universityRepository.init(universities);
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
        interests: new Set(['music', 'sport']),
      },
      languages: {
        nativeLanguage: 'FR',
        masteredLanguages: [],
        learningLanguage: 'EN',
        learningLanguageLevel: 'B2',
      },
      preferences: {
        learningType: 'ETANDEM',
        meetingFrequency: MeetingFrequency.TWICE_A_WEEK,
        sameGender: false,
        goals: new Set([Goal.SPEAK_LIKE_NATIVE]),
      },
    });

    profileRepository.init([instance]);

    const profile = await updateProfileUsecase.execute({
      id: instance.id,
      university: universities[8].id,
    });

    expect(profile.id).toEqual(profile.id);
    expect(profile.university.id).toEqual(universities[8].id);
  });

  it('should throw an error if the profile does not exist', async () => {
    try {
      await updateProfileUsecase.execute({
        id: 'uuid-that-does-not-exist',
        university: universities[8].id,
        meetingFrequency: MeetingFrequency.TWICE_A_WEEK,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ProfileDoesNotExist);
    }
  });

  it('should throw an error if the university does not exist', async () => {
    try {
      const profiles = seedDefinedUsersProfiles(users);
      profileRepository.init(profiles);

      await updateProfileUsecase.execute({
        id: profiles[0].id,
        university: 'uuid-that-does-not-exist',
        meetingFrequency: MeetingFrequency.TWICE_A_WEEK,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UniversityDoesNotExist);
    }
  });
});
