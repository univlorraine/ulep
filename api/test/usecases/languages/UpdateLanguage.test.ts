import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import { seedDefinedLanguages } from '../../seeders/languages';
import { UpdateLanguageUsecase } from '../../../src/core/usecases/languages/update-language.usecase';
import { LanguageDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';

describe('UpdateLanguage', () => {
  const languageRepository = new InMemoryLanguageRepository();
  const updateLanguagesUsecase = new UpdateLanguageUsecase(languageRepository);
  const languages = seedDefinedLanguages(['FR', 'EN', 'ES']);

  beforeEach(() => {
    languageRepository.reset();
    languageRepository.init(languages);
  });

  it('Should persist the changes', async () => {
    let language = await languageRepository.ofCode('FR');
    expect(language.isEnable).toBe(true);

    await updateLanguagesUsecase.execute({
      code: 'FR',
      isEnable: false,
    });

    language = await languageRepository.ofCode('FR');
    expect(language.isEnable).toBe(false);
  });

  it('Should throw an error if the language does not exists', async () => {
    try {
      await updateLanguagesUsecase.execute({
        code: 'DE',
        isEnable: false,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(LanguageDoesNotExist);
    }
  });
});
