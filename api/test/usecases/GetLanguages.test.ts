import { Language } from 'src/core/models/language';
import { GetLanguagesUsecase } from 'src/core/usecases/languages/get-languages.usecase';
import { Collection } from 'src/shared/types/collection';
import { InMemoryLanguageRepository } from 'test/providers/persistance/language.repository';
import seedDefinedNumberOfLanguages from 'test/seeders/languages';

describe('GetLanguages', () => {
  let languageRepository: InMemoryLanguageRepository;
  let getLanguagesUsecase: GetLanguagesUsecase;

  beforeEach(() => {
    languageRepository = new InMemoryLanguageRepository();
    getLanguagesUsecase = new GetLanguagesUsecase(languageRepository);
  });

  it('should return x languages of n page', async () => {
    languageRepository.init(seedDefinedNumberOfLanguages(100));
    const result: Collection<Language>[] = [];

    for (let i = 1; i <= 10; i++) {
      const command = { page: i, limit: 10 };

      const languages = await getLanguagesUsecase.execute(command);

      result.push(languages);
    }

    result.forEach((languages, index) => {
      expect(languages.items.length).toEqual(10);
      expect(languages.totalItems).toEqual(100);
      expect(languages.items).toEqual(
        languageRepository.languages.slice(index * 10, 10 * (index + 1)),
      );
    });
  });
});
