import { UniversityDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';
import { GetUniversityUsecase } from '../../../src/core/usecases/universities/get-university.usecase';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import seedDefinedNumberOfUniversities from '../../seeders/universities';

describe('GetUniversity', () => {
  const universityRepository = new InMemoryUniversityRepository();
  const getUniversityUsecase = new GetUniversityUsecase(universityRepository);

  beforeEach(() => {
    universityRepository.reset();
  });

  it('should return the university', async () => {
    universityRepository.init(
      seedDefinedNumberOfUniversities(1, (x: number) => `uuid-${x}`),
    );

    const university = await getUniversityUsecase.execute({
      id: 'uuid-1',
    });

    expect(university).toBeDefined();
    expect(university.id).toBe('uuid-1');
  });

  it('should throw an error if the university does not exists', async () => {
    try {
      await getUniversityUsecase.execute({
        id: 'uuid-1',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UniversityDoesNotExist);
    }
  });
});
