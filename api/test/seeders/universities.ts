import { Country } from '../../src/core/models/country';
import { University } from '../../src/core/models/university';

const seedDefinedNumberOfUniversities = (
  count: number,
  id: (index: number) => string = (index: number) => `${index}`,
): University[] => {
  const universities: University[] = [];

  let i = count;

  while (i > 0) {
    const instance = new University({
      id: id(i),
      name: 'Université de Lorraine',
      timezone: 'Europe/Paris',
      country: new Country({ id: 'uuid', code: 'FR', name: 'France' }),
      admissionStart: new Date('2000-01-01'),
      admissionEnd: new Date('2000-12-31'),
    });

    universities.push(instance);

    i--;
  }

  return universities;
};

export default seedDefinedNumberOfUniversities;
