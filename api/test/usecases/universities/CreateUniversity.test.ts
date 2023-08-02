import { LanguageFactory, UniversityFactory } from '@app/common';
import { UuidProvider } from '../../../src/providers/services/uuid.provider';
import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { CreateUniversityUsecase } from '../../../src/core/usecases';

describe('CreateUniversity', () => {
  const languageFactory = new LanguageFactory();
  const languages = languageFactory.makeMany(2);

  const universityRepository = new InMemoryUniversityRepository();
  const languageRepository = new InMemoryLanguageRepository();
  const uuidProvider = new UuidProvider();

  const createUniversityUsecase = new CreateUniversityUsecase(
    universityRepository,
    languageRepository,
    uuidProvider,
  );

  beforeEach(() => {
    universityRepository.reset();
    languageRepository.reset();
    languageRepository.init(languages);
  });

  it('Should persist the new instance with the right data', async () => {
    await createUniversityUsecase.execute({
      id: ' uuid',
      name: 'Université de Lorraine',
      campus: ['Nancy', 'Metz'],
      timezone: 'Europe/Paris',
      website: 'https://univ-lorraine.fr',
      languageCodes: languages.map((language) => language.code),
      admissionStart: new Date('2000-01-01'),
      admissionEnd: new Date('2000-12-31'),
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
        id: ' uuid',
        name: instance.name,
        timezone: 'Europe/Paris',
        website: 'https://univ-lorraine.fr',
        campus: ['Nancy', 'Metz'],
        languageCodes: ['FR', 'EN'],
        admissionStart: new Date('2000-01-01'),
        admissionEnd: new Date('2000-12-31'),
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeDefined();
  });
});
