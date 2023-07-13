import * as Prisma from '@prisma/client';
import { Language } from '../../../core/models/language';

export const languageMapper = (instance: Prisma.Language): Language => {
  return new Language({
    name: instance.name,
    code: instance.code,
    isEnable: instance.isAvailable,
  });
};
