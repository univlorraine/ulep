import { Country } from '../../src/core/models/country';

const seedDefinedNumberOfCountries = (
  count: number,
  id: (index: number) => string = (index: number) => `${index}`,
): Country[] => {
  const countries: Country[] = [];

  let i = count;

  while (i > 0) {
    const instance = new Country({
      id: id(i),
      code: 'FR',
      name: 'France',
    });

    countries.push(instance);

    i--;
  }

  return countries;
};

export default seedDefinedNumberOfCountries;
