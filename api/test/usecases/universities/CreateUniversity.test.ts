import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { CreateUniversityUsecase } from '../../../src/core/usecases/universities/create-university.usecase';
import seedDefinedNumberOfUniversities from '../../seeders/universities';
import { UniversityAlreadyExists } from '../../../src/core/errors/RessourceAlreadyExists';
import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import { UniversityDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';

describe('CreateUniversity', () => {
  const universityRepository = new InMemoryUniversityRepository();
  const languageRepository = new InMemoryLanguageRepository();
  const createUniversityUsecase = new CreateUniversityUsecase(
    universityRepository,
    languageRepository,
  );

  beforeEach(() => {
    universityRepository.reset();
    languageRepository.reset();
    languageRepository.init([
      { code: 'FR', name: 'French' },
      { code: 'EN', name: 'English' },
    ]);
  });

  it('Should persist the new instance with the right data', async () => {
    await createUniversityUsecase.execute({
      name: 'Université de Lorraine',
      timezone: 'Europe/Paris',
      website: 'https://univ-lorraine.fr',
      campus: ['Nancy', 'Metz'],
      languageCodes: ['FR', 'EN'],
      admissionStart: new Date('2000-01-01'),
      admissionEnd: new Date('2000-12-31'),
    });

    const instance = await universityRepository.ofName(
      'Université de Lorraine',
    );

    expect(instance).toBeDefined();
  });

  it('Should throw an error if the name already exists', async () => {
    universityRepository.init(seedDefinedNumberOfUniversities(1));

    try {
      await createUniversityUsecase.execute({
        name: 'Université de Lorraine',
        timezone: 'Europe/Paris',
        website: 'https://univ-lorraine.fr',
        campus: ['Nancy', 'Metz'],
        languageCodes: ['FR', 'EN'],
        admissionStart: new Date('2000-01-01'),
        admissionEnd: new Date('2000-12-31'),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UniversityAlreadyExists);
    }
  });

  it('Should throw an error if the parent does not exists', async () => {
    try {
      await createUniversityUsecase.execute({
        parent: 'uuid_does_not_exists',
        name: 'Université de Lorraine',
        timezone: 'Europe/Paris',
        website: 'https://univ-lorraine.fr',
        campus: ['Nancy', 'Metz'],
        languageCodes: ['FR', 'EN'],
        admissionStart: new Date('2000-01-01'),
        admissionEnd: new Date('2000-12-31'),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UniversityDoesNotExist);
    }
  });
});
