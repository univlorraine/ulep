import * as Prisma from '@prisma/client';
import { Language, SuggestedLanguage } from 'src/core/models';
import {
  UserRelations,
  UserSnapshot,
  userMapper,
} from 'src/providers/persistance/mappers/user.mapper';

export const SuggestedLanguageRelations = {
  LanguageCode: true,
  User: { include: UserRelations },
};

export type SuggestedLanguageSnapshot = Prisma.SuggestedLanguages & {
  LanguageCode: Prisma.LanguageCodes;
  User: UserSnapshot;
};

export const suggestedLanguageMapper = (
  instance: SuggestedLanguageSnapshot,
): SuggestedLanguage =>
  new SuggestedLanguage({
    id: instance.id,
    language: {
      id: instance.LanguageCode.id,
      code: instance.LanguageCode.code,
    },
    user: userMapper(instance.User),
  });

export type LanguageSnapshot = Prisma.LanguageCodes;

export const languageMapper = (instance: LanguageSnapshot): Language =>
  new Language({
    id: instance.id,
    code: instance.code,
    name: instance.name,
  });
