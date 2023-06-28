import * as Prisma from '@prisma/client';
import { Language } from '../../../core/models/language';

export const languageMapper = (instance: Prisma.LanguageCode): Language => {
  return new Language({ ...instance });
};
