import { Language } from '../../src/core/models/language';

export const seedDefinedNumberOfLanguages = (count: number): Language[] => {
  const languages: Language[] = [];

  let i = count;

  while (i > 0) {
    const instance = new Language({
      code: `L${i}`,
      name: 'French',
      isEnable: true,
    });

    languages.push(instance);

    i--;
  }

  return languages;
};

export const seedDefinedLanguages = (codes: string[]): Language[] => {
  const languages: Language[] = [];

  codes.forEach((code) => {
    const instance = new Language({
      code,
      name: 'French',
      isEnable: true,
    });

    languages.push(instance);
  });

  return languages;
};
