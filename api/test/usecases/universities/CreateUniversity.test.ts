import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { CreateUniversityUsecase } from '../../../src/core/usecases/universities/create-university.usecase';
import { InMemoryCountryRepository } from '../../../src/providers/persistance/repositories/in-memory-country-repository';
import { Country } from '../../../src/core/models/country';
import seedDefinedNumberOfUniversities from '../../seeders/universities';
import { UniversityAlreadyExists } from '../../../src/core/errors/RessourceAlreadyExists';
import { CountryDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';

describe('CreateUniversity', () => {
  const universityRepository = new InMemoryUniversityRepository();
  const countryRepository = new InMemoryCountryRepository();
  const createUniversityUsecase = new CreateUniversityUsecase(
    universityRepository,
    countryRepository,
  );

  beforeEach(() => {
    universityRepository.reset();
    countryRepository.reset();
    countryRepository.init([
      new Country({ id: 'uuid', code: 'FR', name: 'France' }),
    ]);
  });

  it('Should persist the new instance with the right data', async () => {
    await createUniversityUsecase.execute({
      name: 'Université de Lorraine',
      timezone: 'Europe/Paris',
      countryCode: 'FR',
      admissionStart: new Date('2000-01-01'),
      admissionEnd: new Date('2000-12-31'),
    });

    const instance = await universityRepository.ofName(
      'Université de Lorraine',
    );

    expect(instance).toBeDefined();
    expect(instance.timezone).toBe('Europe/Paris');
    expect(instance.country.code).toBe('FR');
  });

  it('Should throw an error if the name already exists', async () => {
    universityRepository.init(seedDefinedNumberOfUniversities(1));

    try {
      await createUniversityUsecase.execute({
        name: 'Université de Lorraine',
        timezone: 'Europe/Paris',
        countryCode: 'FR',
        admissionStart: new Date('2000-01-01'),
        admissionEnd: new Date('2000-12-31'),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UniversityAlreadyExists);
    }
  });

  it('Should throw an error if the country does not exists', async () => {
    try {
      await createUniversityUsecase.execute({
        name: 'Université de Lorraine',
        timezone: 'Europe/Paris',
        countryCode: 'JP',
        admissionStart: new Date('2000-01-01'),
        admissionEnd: new Date('2000-12-31'),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CountryDoesNotExist);
    }
  });
});
