import * as Prisma from '@prisma/client';
import { Language } from 'src/core/models';

export type LanguageSnapshot = Prisma.LanguageCodes;

export const languageMapper = (instance: LanguageSnapshot): Language =>
  new Language({
    id: instance.id,
    code: instance.code,
    name: instance.name,
  });
