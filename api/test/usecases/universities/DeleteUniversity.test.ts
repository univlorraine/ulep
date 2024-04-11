import { UniversityFactory } from '@app/common';
import { DeleteUniversityUsecase } from '../../../src/core/usecases';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { InMemoryUserRepository } from 'src/providers/persistance/repositories/in-memory-user-repository';

describe('DeleteUniversity', () => {
  const factory = new UniversityFactory();
  const userRepository = new InMemoryUserRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const deleteUniversityUsecase = new DeleteUniversityUsecase(
    universityRepository,
    userRepository,
  );

  beforeEach(() => {
    universityRepository.reset();
  });

  it('Should delete the instance', async () => {
    const parent = factory.makeOne();

    const university = factory.makeOne({
      parent: parent.id,
    });

    universityRepository.init([parent, university]);

    await deleteUniversityUsecase.execute({ id: university.id });

    const instance = await universityRepository.ofName(university.name);

    expect(instance).toBeUndefined();
  });

  it('Should throw an error if the instance does not exists', async () => {
    let exception: Error | undefined;

    try {
      await deleteUniversityUsecase.execute({ id: 'uuid' });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeDefined();
  });
});
