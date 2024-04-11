import * as Prisma from '@prisma/client';
import { ProficiencyLevel } from 'src/core/models';
import { languageMapper } from './language.mapper';
import { TestedLanguage } from 'src/core/models/tested-language.model';

export const TestedLanguageRelations = {
  LanguageCode: true,
};

export type TestedLanguageSnapshot = Prisma.TestedLanguages & {
  LanguageCode: Prisma.LanguageCodes;
};

export const testedLanguageMapper = (
  instance: TestedLanguageSnapshot,
): TestedLanguage => {
  return new TestedLanguage({
    language: languageMapper(instance.LanguageCode),
    level: ProficiencyLevel[instance.level],
  });
};
