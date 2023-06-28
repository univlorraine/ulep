import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import seedDefinedNumberOfUniversities from '../../seeders/universities';
import { DeleteUniversityUsecase } from '../../../src/core/usecases/universities/delete-university.usecase';
import { UniversityDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';

describe('DeleteUniversity', () => {
  const universityRepository = new InMemoryUniversityRepository();
  const deleteUniversityUsecase = new DeleteUniversityUsecase(
    universityRepository,
  );

  beforeEach(() => {
    universityRepository.reset();
  });

  it('Should delete the instance', async () => {
    universityRepository.init(seedDefinedNumberOfUniversities(1));

    const university = await universityRepository.ofName(
      'Université de Lorraine',
    );

    await deleteUniversityUsecase.execute({ id: university.id });

    const instance = await universityRepository.ofName(
      'Université de Lorraine',
    );

    expect(instance).toBeUndefined();
  });

  it('Should throw an error if the instance does not exists', async () => {
    try {
      await deleteUniversityUsecase.execute({ id: 'uuid' });
    } catch (error) {
      expect(error).toBeInstanceOf(UniversityDoesNotExist);
    }
  });
});
