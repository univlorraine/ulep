import * as Prisma from '@prisma/client';
import {
  ProfileSnapshot,
  ProfilesRelations,
  profileMapper,
} from './profile.mapper';
import {
  LearningLanguage,
  LearningLanguageWithTandem,
  ProficiencyLevel,
  Tandem,
  TandemStatus,
} from 'src/core/models';
import { languageMapper } from './language.mapper';

export const LearningLanguageRelations = {
  Profile: {
    include: ProfilesRelations,
  },
  LanguageCode: true,
};

export type LearningLanguageSnapshot = Prisma.LearningLanguages & {
  Profile: ProfileSnapshot;
  LanguageCode: Prisma.LanguageCodes;
};

export const learningLanguageMapper = (
  instance: LearningLanguageSnapshot,
): LearningLanguage => {
  return new LearningLanguage({
    id: instance.id,
    language: languageMapper(instance.LanguageCode),
    level: ProficiencyLevel[instance.level],
    profile: profileMapper(instance.Profile),
    createdAt: instance.created_at,
  });
};

export const LearningLanguageWithTandemRelations = {
  ...LearningLanguageRelations,
  Tandem: true,
};

export type LearningLanguageWithTandemSnapshot = LearningLanguageSnapshot & {
  Tandem: Prisma.Tandems;
};

export const learningLanguageWithTandemMapper = (
  instance: LearningLanguageWithTandemSnapshot,
): LearningLanguageWithTandem => {
  return new LearningLanguageWithTandem({
    id: instance.id,
    language: languageMapper(instance.LanguageCode),
    level: ProficiencyLevel[instance.level],
    profile: profileMapper(instance.Profile),
    createdAt: instance.created_at,
    tandem:
      instance.Tandem &&
      new Tandem({
        id: instance.Tandem.id,
        status: TandemStatus[instance.Tandem.status],
      }),
  });
};
