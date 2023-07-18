import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import { seedDefinedLanguages } from '../../seeders/languages';
import { CreateLanguageUsecase } from '../../../src/core/usecases/languages/create-language.usecase';
import { RessourceAlreadyExists } from '../../../src/core/errors/RessourceAlreadyExists';

describe('CreateLanguage', () => {
  const languageRepository = new InMemoryLanguageRepository();
  const createLanguagesUsecase = new CreateLanguageUsecase(languageRepository);
  const languages = seedDefinedLanguages(['FR', 'EN', 'ES']);

  beforeEach(() => {
    languageRepository.reset();
    languageRepository.init(languages);
  });

  it('Should persist the new language with the right data', async () => {
    await createLanguagesUsecase.execute({
      code: 'DE',
      name: 'German',
      isEnable: true,
    });

    const language = await languageRepository.ofCode('DE');

    expect(language).toBeDefined();
    expect(language.code).toBe('DE');
    expect(language.name).toBe('German');
    expect(language.isEnable).toBe(true);
  });

  it('Should throw an error if the language code already exists', async () => {
    try {
      await createLanguagesUsecase.execute({
        code: 'FR',
        name: 'French',
        isEnable: true,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(RessourceAlreadyExists);
    }
  });
});
