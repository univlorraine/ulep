import seedDefinedNumberOfProfiles from '../../seeders/profiles';
import {
  Goal,
  MeetingFrequency,
  Profile,
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

describe('UpdateProfile', () => {
  const profileRepository = new InMemoryProfileRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const countryRepository = new InMemoryCountryRepository();
  const updateProfileUsecase = new UpdateProfileUsecase(
    profileRepository,
    universityRepository,
  );

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
    const instance = new Profile({
      id: 'uuid-1',
      email: 'jane.doe@mail.com',
      firstname: 'Jane',
      lastname: 'Doe',
      birthdate: new Date('1988-01-01'),
      role: 'STUDENT',
      gender: 'FEMALE',
      university: universities[0],
      nationality: countries[0],
      goals: [Goal.ORAL_PRACTICE],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      bios: 'Lorem ipsum dolor sit amet',
    });

    profileRepository.init([instance]);

    const profile = await updateProfileUsecase.execute({
      id: instance.id,
      university: universities[8].id,
      goals: [Goal.PREPARE_TRAVEL_ABROAD],
      meetingFrequency: MeetingFrequency.TWICE_A_WEEK,
    });

    expect(profile.id).toEqual(profile.id);
    expect(profile.university.id).toEqual(universities[8].id);
    expect(profile.goals).toEqual([Goal.PREPARE_TRAVEL_ABROAD]);
    expect(profile.meetingFrequency).toEqual(MeetingFrequency.TWICE_A_WEEK);
  });

  it('should throw an error if the profile does not exist', async () => {
    try {
      await updateProfileUsecase.execute({
        id: 'uuid-that-does-not-exist',
        university: universities[8].id,
        goals: [Goal.PREPARE_TRAVEL_ABROAD],
        meetingFrequency: MeetingFrequency.TWICE_A_WEEK,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ProfileDoesNotExist);
    }
  });

  it('should throw an error if the university does not exist', async () => {
    try {
      profileRepository.init(
        seedDefinedNumberOfProfiles(1, (x: number) => `uuid-${x}`),
      );

      await updateProfileUsecase.execute({
        id: 'uuid-1',
        university: 'uuid-that-does-not-exist',
        goals: [Goal.PREPARE_TRAVEL_ABROAD],
        meetingFrequency: MeetingFrequency.TWICE_A_WEEK,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UniversityDoesNotExist);
    }
  });
});
