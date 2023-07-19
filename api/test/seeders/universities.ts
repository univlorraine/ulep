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
      website: 'https://univ-lorraine.fr',
      campus: ['Nancy', 'Metz'],
      languages: [
        { name: 'French', code: 'FR' },
        { name: 'English', code: 'EN' },
      ],
      timezone: 'Europe/Paris',
      admissionStart: new Date('2000-01-01'),
      admissionEnd: new Date('2000-12-31'),
    });

    universities.push(instance);

    i--;
  }

  return universities;
};

export default seedDefinedNumberOfUniversities;
