import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import seedDefinedNumberOfLanguages from '../../seeders/languages';
import { UpdateLanguageUsecase } from '../../../src/core/usecases/languages/update-language.usecase';
import { LanguageDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';

describe('UpdateLanguage', () => {
  const languageRepository = new InMemoryLanguageRepository();
  const updateLanguagesUsecase = new UpdateLanguageUsecase(languageRepository);
  const languages = seedDefinedNumberOfLanguages(1, (index) => `uuid-${index}`);

  beforeEach(() => {
    languageRepository.reset();
    languageRepository.init(languages);
  });

  it('Should persist the changes', async () => {
    let language = await languageRepository.ofId('uuid-1');
    expect(language.isEnable).toBe(true);

    await updateLanguagesUsecase.execute({
      id: 'uuid-1',
      isEnable: false,
    });

    language = await languageRepository.ofId('uuid-1');
    expect(language.isEnable).toBe(false);
  });

  it('Should throw an error if the language does not exists', async () => {
    try {
      await updateLanguagesUsecase.execute({
        id: 'uuid',
        isEnable: false,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(LanguageDoesNotExist);
    }
  });
});
