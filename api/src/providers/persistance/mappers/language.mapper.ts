import * as Prisma from '@prisma/client';
import { Language, LanguageStatus, SuggestedLanguage } from 'src/core/models';
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
    language: new Language({
      id: instance.LanguageCode.id,
      name: instance.LanguageCode.name,
      code: instance.LanguageCode.code,
      mainUniversityStatus: instance.LanguageCode
        .mainUniversityStatus as LanguageStatus,
      secondaryUniversityActive:
        instance.LanguageCode.secondaryUniversityActive,
    }),
    user: userMapper(instance.User),
  });

export type LanguageSnapshot = Prisma.LanguageCodes;

export const languageMapper = (instance: LanguageSnapshot): Language =>
  new Language({
    id: instance.id,
    code: instance.code,
    name: instance.name,
    mainUniversityStatus: instance.mainUniversityStatus as LanguageStatus,
    secondaryUniversityActive: instance.secondaryUniversityActive,
  });
