import { UniversityFactory, UserFactory } from '@app/common';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { GetUniversityDivisionsUsecase } from '../../../src/core/usecases';
import { InMemoryUserRepository } from 'src/providers/persistance/repositories/in-memory-user-repository';

describe('GetUniversityDivisions', () => {
  const universityRepository = new InMemoryUniversityRepository();
  const userRepository = new InMemoryUserRepository();

  const getUniversityDivisionsUsecase = new GetUniversityDivisionsUsecase(
    universityRepository,
    userRepository,
  );

  const universityFactory = new UniversityFactory();
  const university1 = universityFactory.makeOne();
  const university2 = universityFactory.makeOne();
  universityRepository.init([university1, university2]);

  const userFactory = new UserFactory();
  const user = userFactory.makeOne({
    university: university1,
    division: 'Division 1',
  });
  const user2 = userFactory.makeOne({
    university: university1,
    division: 'Division 2',
  });
  const user3 = userFactory.makeOne({
    university: university1,
    division: 'Division 2',
  });
  const user4 = userFactory.makeOne({
    university: university2,
    division: 'Division 3',
  });
  userRepository.init([user, user2, user3, user4]);

  it('Should throw an error if the university does not exist', async () => {
    let exception: Error | undefined;

    try {
      await getUniversityDivisionsUsecase.execute('123');
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeDefined();
  });

  it('Should return the divisions of the university users only and without duplicates', async () => {
    const divisions = await getUniversityDivisionsUsecase.execute(
      university1.id,
    );

    const expectedDivisions = ['Division 1', 'Division 2'];

    expect(divisions).toEqual(expectedDivisions);
  });
});
