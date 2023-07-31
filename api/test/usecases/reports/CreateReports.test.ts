import { RessourceDoesNotExist } from '../../../src/core/errors';
import { CreateReportUsecase } from '../../../src/core/usecases';
import { InMemoryReportsRepository } from '../../../src/providers/persistance/repositories/in-memory-reports-repository';
import { InMemoryUserRepository } from '../../../src/providers/persistance/repositories/in-memory-user-repository';
import { UserFactory } from '../../factories/user.factory';

describe('CreateReport', () => {
  const userFactory = new UserFactory();
  const user = userFactory.makeOne();

  const reportsRepository = new InMemoryReportsRepository();
  const userRepositiry = new InMemoryUserRepository();
  const createReportsUsecase = new CreateReportUsecase(
    reportsRepository,
    userRepositiry,
  );

  beforeEach(() => {
    reportsRepository.reset();
    userRepositiry.reset();
  });

  it('Should persist the new Report with the right data', async () => {
    const user = userFactory.makeOne();
    userRepositiry.init([user]);

    reportsRepository.createCategory({
      id: '1',
      name: { id: 'uuid', content: 'category', language: 'en' },
    });

    await createReportsUsecase.execute({
      id: '1',
      owner: user.id,
      content: 'content',
      category: '1',
    });

    const report = await reportsRepository.reportOfId('1');

    expect(report).toBeDefined();
  });

  it('Should throw an error if the category does not exists', async () => {
    try {
      await createReportsUsecase.execute({
        id: '1',
        content: 'content',
        category: 'uuid_does_not_exists',
        owner: user.id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(RessourceDoesNotExist);
    }
  });

  it('Should throw an error if the user does not exists', async () => {
    let exception: Error | undefined;

    reportsRepository.createCategory({
      id: '1',
      name: { id: 'uuid', content: 'category', language: 'en' },
    });

    try {
      await createReportsUsecase.execute({
        id: '1',
        content: 'content',
        category: '1',
        owner: 'uuid_does_not_exists',
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeDefined();
  });
});
