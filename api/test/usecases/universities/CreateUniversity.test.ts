import {
  CountryFactory,
  LanguageFactory,
  UniversityFactory,
} from '@app/common';
import { UuidProvider } from '../../../src/providers/services/uuid.provider';
import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { CreateUniversityUsecase } from '../../../src/core/usecases';
import { InMemoryCountryCodesRepository } from 'src/providers/persistance/repositories/in-memory-country-repository';

describe('CreateUniversity', () => {
  const languageFactory = new LanguageFactory();
  const countryFactory = new CountryFactory();
  const languages = languageFactory.makeMany(2);
  const countries = countryFactory.makeMany(2);

  const countryRepository = new InMemoryCountryCodesRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const languageRepository = new InMemoryLanguageRepository();
  const uuidProvider = new UuidProvider();

  const createUniversityUsecase = new CreateUniversityUsecase(
    countryRepository,
    universityRepository,
    uuidProvider,
  );

  beforeEach(() => {
    universityRepository.reset();
    languageRepository.reset();
    countryRepository.init(countries);
    languageRepository.init(languages);
  });

  it('Should persist the new instance with the right data', async () => {
    await createUniversityUsecase.execute({
      name: 'Université de Lorraine',
      timezone: 'Europe/Paris',
      website: 'https://univ-lorraine.fr',
      admissionStart: new Date('2000-01-01'),
      admissionEnd: new Date('2000-12-31'),
      countryId: countries[0].id,
      campusNames: [],
    });

    const instance = await universityRepository.ofName(
      'Université de Lorraine',
    );

    expect(instance).toBeDefined();
  });

  it('Should throw an error if the name already exists', async () => {
    let exception: Error | undefined;

    const factory = new UniversityFactory();
    const instance = factory.makeOne();

    universityRepository.init([instance]);

    try {
      await createUniversityUsecase.execute({
        name: instance.name,
        timezone: 'Europe/Paris',
        website: 'https://univ-lorraine.fr',
        countryId: countries[0].id,
        campusNames: [],
        admissionStart: new Date('2000-01-01'),
        admissionEnd: new Date('2000-12-31'),
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeDefined();
  });
});
