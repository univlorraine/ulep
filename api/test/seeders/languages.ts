import { Language } from '../../src/core/models/language';

const seedDefinedNumberOfLanguages = (
  count: number,
  id: (index: number) => string = (index: number) => `${index}`,
): Language[] => {
  const languages: Language[] = [];

  let i = count;

  while (i > 0) {
    const instance = new Language({
      id: id(i),
      code: 'FR',
      name: 'French',
      isEnable: true,
    });

    languages.push(instance);

    i--;
  }

  return languages;
};

export default seedDefinedNumberOfLanguages;
