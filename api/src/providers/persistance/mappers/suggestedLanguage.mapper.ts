import * as Prisma from '@prisma/client';
import { SuggestedLanguage, LanguageStatus, Language } from 'src/core/models';
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
      isDiscovery: instance.LanguageCode.isDiscovery,
    }),
    user: userMapper(instance.User),
    createdAt: instance.created_at,
  });
