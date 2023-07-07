import seedDefinedNumberOfUsers from '../../seeders/users';
import { GetProfilesUsecase } from '../../../src//core/usecases/profiles/get-profiles.usecase';
import { InMemoryProfileRepository } from '../../../src//providers/persistance/repositories/in-memory-profile-repository';
import seedDefinedUsersProfiles from '../../seeders/profiles';

describe('GetProfiles', () => {
  const profileRepository = new InMemoryProfileRepository();
  const getProfilesUsecase = new GetProfilesUsecase(profileRepository);

  beforeEach(() => {
    profileRepository.reset();
  });

  it('should get profiles', async () => {
    const users = seedDefinedNumberOfUsers(10);
    const profiles = seedDefinedUsersProfiles(users);
    profileRepository.init(profiles);

    const collection = await getProfilesUsecase.execute({ page: 1, limit: 10 });

    expect(collection.items).toHaveLength(10);
  });

  it('should return empty array on paginated', async () => {
    const users = seedDefinedNumberOfUsers(10);
    const profiles = seedDefinedUsersProfiles(users);
    profileRepository.init(profiles);

    const collection = await getProfilesUsecase.execute({ page: 2, limit: 30 });

    expect(collection.items).toHaveLength(0);
    expect(collection.totalItems).toBe(10);
  });
});
