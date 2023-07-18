import {
  Gender,
  Goal,
  MeetingFrequency,
  Profile,
  Role,
} from '../../../src/core/models/profile';
import { InMemoryCountryRepository } from '../../../src/providers/persistance/repositories/in-memory-country-repository';
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import {
  ProfileDoesNotExist,
  UniversityDoesNotExist,
} from '../../../src/core/errors/RessourceDoesNotExist';
import { UpdateProfileUsecase } from '../../../src/core/usecases/profiles/update-profile.usecase';
import seedDefinedNumberOfCountries from '../../seeders/countries';
import seedDefinedNumberOfUniversities from '../../seeders/universities';
import seedDefinedNumberOfUsers from '../../seeders/users';
import seedDefinedUsersProfiles from '../../seeders/profiles';

describe('UpdateProfile', () => {
  const profileRepository = new InMemoryProfileRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const countryRepository = new InMemoryCountryRepository();
  const updateProfileUsecase = new UpdateProfileUsecase(
    profileRepository,
    universityRepository,
  );

  const users = seedDefinedNumberOfUsers(10);

  const countries = seedDefinedNumberOfCountries(
    10,
    (x: number) => `uuid-${x}`,
  );

  const universities = seedDefinedNumberOfUniversities(
    10,
    (x: number) => `uuid-${x}`,
  );

  beforeEach(() => {
    profileRepository.reset();
    universityRepository.reset();
    countryRepository.reset();

    countryRepository.init(countries);
    universityRepository.init(universities);
  });

  it('should update a profile', async () => {
    const user = users[0];

    const instance = new Profile({
      id: 'uuid-1',
      user: user,
      firstname: 'Jane',
      lastname: 'Doe',
      age: 25,
      role: Role.STUDENT,
      gender: Gender.FEMALE,
      university: universities[0],
      nationality: countries[0],
      nativeLanguage: {
        code: 'FR',
      },
      learningLanguage: {
        code: 'EN',
      },
      learningLanguageLevel: 'B2',
      masteredLanguages: [],
      goals: new Set([Goal.ORAL_PRACTICE]),
      interests: new Set(['music', 'sport']),
      preferences: {
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        sameGender: true,
      },
      bios: 'Lorem ipsum dolor sit amet',
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
