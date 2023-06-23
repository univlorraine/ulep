import { GetProfilesUsecase } from '../../../src//core/usecases/profiles/get-profiles.usecase';
import { InMemoryCountryRepository } from '../../../src//providers/persistance/repositories/in-memory-country-repository';
import { InMemoryProfileRepository } from '../../../src//providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryUniversityRepository } from '../../../src//providers/persistance/repositories/in-memory-university-repository';
import seedDefinedNumberOfProfiles from '../../seeders/profiles';

describe('GetProfiles', () => {
  const profileRepository = new InMemoryProfileRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const countryRepository = new InMemoryCountryRepository();
  const getProfilesUsecase = new GetProfilesUsecase(profileRepository);

  beforeEach(() => {
    profileRepository.reset();
    universityRepository.reset();
    countryRepository.reset();
  });

  it('should get profiles', async () => {
    profileRepository.init(
      seedDefinedNumberOfProfiles(10, (x: number) => `uuid-${x}`),
    );

    const profiles = await getProfilesUsecase.execute({ page: 1, limit: 10 });

    expect(profiles.items).toHaveLength(10);
  });

  it('should return empty array on paginated', async () => {
    profileRepository.init(
      seedDefinedNumberOfProfiles(10, (x: number) => `uuid-${x}`),
    );

    const profiles = await getProfilesUsecase.execute({ page: 2, limit: 30 });

    expect(profiles.items).toHaveLength(0);
    expect(profiles.totalItems).toBe(10);
  });
});
