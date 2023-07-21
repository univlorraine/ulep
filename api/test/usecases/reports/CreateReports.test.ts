import { CreateReportUsecase } from '../../../src/core/usecases/reports';
import { InMemoryReportsRepository } from '../../../src/providers/persistance/repositories/in-memory-reports-repository';
import { InMemoryUserRepository } from '../../../src/providers/persistance/repositories/in-memory-user-repository';
import { User } from '../../../src/core/models/user';
import { RessourceDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';

describe('CreateReport', () => {
  const reportsRepository = new InMemoryReportsRepository();
  const userRepositiry = new InMemoryUserRepository();
  const createReportsUsecase = new CreateReportUsecase(
    reportsRepository,
    userRepositiry,
  );

  const defaultCategory = {
    id: '1',
    name: 'defaultCategory',
  };

  const user = new User({
    id: '1',
    email: 'jane.doe@mail.com',
    firstname: 'Jane',
    lastname: 'Doe',
  });

  beforeEach(() => {
    reportsRepository.reset();
    userRepositiry.reset();

    userRepositiry.init([user]);
    reportsRepository.init([defaultCategory], []);
  });

  it('Should persist the new Report with the right data', async () => {
    await createReportsUsecase.execute({
      id: '1',
      content: 'content',
      category: '1',
      userId: user.id,
    });

    const language = await reportsRepository.ofId('1');

    expect(language).toBeDefined();
  });

  it('Should throw an error if the category does not exists', async () => {
    try {
      await createReportsUsecase.execute({
        id: '1',
        content: 'content',
        category: 'uuid_does_not_exists',
        userId: user.id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(RessourceDoesNotExist);
    }
  });

  it('Should throw an error if the user does not exists', async () => {
    try {
      await createReportsUsecase.execute({
        id: '1',
        content: 'content',
        category: '1',
        userId: 'uuid_does_not_exists',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(RessourceDoesNotExist);
    }
  });
});
