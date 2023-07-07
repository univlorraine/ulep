import seedDefinedNumberOfUsers from '../../seeders/users';
import { ProfileDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';
import { DeleteProfileUsecase } from '../../../src/core/usecases/profiles/delete-profile.usecase';
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import seedDefinedUsersProfiles from '../../seeders/profiles';

describe('DeleteProfile', () => {
  const profileRepository = new InMemoryProfileRepository();
  const deleteProfileUsecase = new DeleteProfileUsecase(profileRepository);

  beforeEach(() => {
    profileRepository.reset();
  });

  it('should delete a profile', async () => {
    const users = seedDefinedNumberOfUsers(1);
    const profiles = seedDefinedUsersProfiles(users);
    profileRepository.init(profiles);

    await deleteProfileUsecase.execute({ id: profiles[0].id });

    const profilesAfterDelete = await profileRepository.findAll();

    expect(profilesAfterDelete.items).toHaveLength(0);
  });

  it('should throw an error if profile does not exist', async () => {
    try {
      await deleteProfileUsecase.execute({ id: 'uuid-1' });
    } catch (error) {
      expect(error).toBeInstanceOf(ProfileDoesNotExist);
    }
  });
});
