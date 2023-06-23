import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import seedDefinedNumberOfLanguages from '../../seeders/languages';
import { CreateLanguageUsecase } from '../../../src/core/usecases/languages/create-language.usecase';
import { RessourceAlreadyExists } from '../../../src/core/errors/RessourceAlreadyExists';

describe('CreateLanguage', () => {
  const languageRepository = new InMemoryLanguageRepository();
  const createLanguagesUsecase = new CreateLanguageUsecase(languageRepository);
  const languages = seedDefinedNumberOfLanguages(100);

  beforeEach(() => {
    languageRepository.reset();
    languageRepository.init(languages);
  });

  it('Should persist the new language with the right data', async () => {
    await createLanguagesUsecase.execute({
      id: 'uuid',
      code: 'ES',
      name: 'Spanish',
      isEnable: true,
    });

    const language = await languageRepository.of('uuid');

    expect(language).toBeDefined();
    expect(language.code).toBe('ES');
    expect(language.name).toBe('Spanish');
    expect(language.isEnable).toBe(true);
  });

  it('Should throw an error if the language code already exists', async () => {
    try {
      await createLanguagesUsecase.execute({
        id: 'uuid',
        code: 'FR',
        name: 'French',
        isEnable: true,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(RessourceAlreadyExists);
    }
  });
});
