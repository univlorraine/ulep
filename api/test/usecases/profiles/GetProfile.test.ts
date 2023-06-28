import seedDefinedNumberOfProfiles from '../../seeders/profiles';
import { Country } from '../../../src/core/models/country';
import { University } from '../../../src/core/models/university';
import { InMemoryCountryRepository } from '../../../src/providers/persistance/repositories/in-memory-country-repository';
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { GetProfileUsecase } from '../../../src/core/usecases/profiles/get-profile.usecase';
import { ProfileDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';

describe('GetProfile', () => {
  const profileRepository = new InMemoryProfileRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const countryRepository = new InMemoryCountryRepository();
  const getProfileUsecase = new GetProfileUsecase(profileRepository);

  const country = new Country({
    id: 'uuid-1',
    name: 'United Kingdom',
    code: 'UK',
  });

  const university = new University({
    id: 'uuid-1',
    name: 'University of Oxford',
    country,
    timezone: 'Europe/London',
    admissionStart: new Date('2020-01-01'),
    admissionEnd: new Date('2020-12-31'),
  });

  beforeEach(() => {
    profileRepository.reset();
    universityRepository.reset();
    countryRepository.reset();
    countryRepository.init([country]);
    universityRepository.init([university]);
  });

  it('should get a profile', async () => {
    profileRepository.init(
      seedDefinedNumberOfProfiles(1, (x: number) => `uuid-${x}`),
    );

    const profile = await getProfileUsecase.execute({
      id: 'uuid-1',
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
