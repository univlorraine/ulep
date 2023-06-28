import { GetCountriesUsecase } from '../../../src/core/usecases/countries/get-countries.usecase';
import { InMemoryCountryRepository } from '../../../src/providers/persistance/repositories/in-memory-country-repository';
import { Country } from '../../../src/core/models/country';

describe('GetCountries', () => {
  let countryRepository: InMemoryCountryRepository;
  let getCountiesUsecase: GetCountriesUsecase;

  beforeEach(async () => {
    countryRepository = new InMemoryCountryRepository();
    getCountiesUsecase = new GetCountriesUsecase(countryRepository);
  });

  it('Should return collection of all countries', async () => {
    const countries: Country[] = [
      new Country({ id: '1', code: 'ES', name: 'Spain' }),
      new Country({ id: '2', code: 'FR', name: 'France' }),
    ];

    countryRepository.init(countries);

    const response = await getCountiesUsecase.execute();

    expect(response).toEqual({
      items: countries,
      totalItems: countries.length,
    });
  });
});
