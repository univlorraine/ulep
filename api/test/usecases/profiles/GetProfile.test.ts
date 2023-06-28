import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { GetProfileUsecase } from '../../../src/core/usecases/profiles/get-profile.usecase';
import { ProfileDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';
import seedDefinedNumberOfUsers from '../../seeders/users';
import seedDefinedUsersProfiles from '../../seeders/profiles';

describe('GetProfile', () => {
  const profileRepository = new InMemoryProfileRepository();
  const getProfileUsecase = new GetProfileUsecase(profileRepository);

  const users = seedDefinedNumberOfUsers(1);

  beforeEach(() => {
    profileRepository.reset();
  });

  it('should get a profile', async () => {
    const profiles = seedDefinedUsersProfiles(users);
    profileRepository.init(profiles);

    const profile = await getProfileUsecase.execute({
      id: profiles[0].id,
    });

    expect(profile).toBeDefined();
  });

  it('should throw an error if profile does not exist', async () => {
    try {
      await getProfileUsecase.execute({
        id: 'uuid-1',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ProfileDoesNotExist);
    }
  });
});
