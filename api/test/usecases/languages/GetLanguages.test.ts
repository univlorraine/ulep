import { LanguageFactory } from '@app/common';
import { FindAllLanguageCodeUsecase } from 'src/core/usecases';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';

describe('GetLanguages', () => {
  const repository = new InMemoryLanguageRepository();
  const usecase = new FindAllLanguageCodeUsecase(repository);

  beforeEach(() => {
    repository.reset();
  });

  it('should return all languages without pagination', async () => {
    const factory = new LanguageFactory();

    const languages = factory.makeMany(100);

    repository.init(languages);

    const result = await usecase.execute({
      orderBy: { order: 'asc' },
    });

    expect(result).toEqual(languages);
  });
});
