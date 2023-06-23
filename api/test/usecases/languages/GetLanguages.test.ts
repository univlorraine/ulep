import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import { GetLanguagesUsecase } from '../../../src/core/usecases/languages/get-languages.usecase';
import seedDefinedNumberOfLanguages from '../../seeders/languages';
import { Collection } from '../../../src/shared/types/collection';
import { Language } from '../../../src/core/models/language';

describe('GetLanguages', () => {
  const languageRepository = new InMemoryLanguageRepository();
  const getLanguagesUsecase = new GetLanguagesUsecase(languageRepository);

  beforeEach(() => {
    languageRepository.reset();
  });

  it('should return x languages of n page', async () => {
    const ITEMS_PER_PAGE = 30;
    const ITEMS_COUNT = 100;
    const NB_PAGES = Math.floor(ITEMS_COUNT / ITEMS_PER_PAGE);
    const REST = 100 % ITEMS_PER_PAGE;
    languageRepository.init(seedDefinedNumberOfLanguages(ITEMS_COUNT));

    const result: Collection<Language>[] = [];

    for (let i = 1; i <= NB_PAGES; i++) {
      const command = { page: i, limit: ITEMS_PER_PAGE };

      const languages = await getLanguagesUsecase.execute(command);

      result.push(languages);
    }

    result.forEach((languages, index) => {
      expect(languages.items.length).toEqual(
        index === NB_PAGES ? REST : ITEMS_PER_PAGE,
      );

      expect(languages.totalItems).toEqual(ITEMS_COUNT);

      expect(languages.items).toEqual(
        languageRepository.languages.slice(
          index * ITEMS_PER_PAGE,
          index === NB_PAGES ? ITEMS_COUNT : (index + 1) * ITEMS_PER_PAGE,
        ),
      );
    });
  });
});
