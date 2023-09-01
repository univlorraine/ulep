import * as Prisma from '@prisma/client';
import {
  ProfileSnapshot,
  ProfilesRelations,
  profileMapper,
} from './profile.mapper';
import { LearningLanguage, ProficiencyLevel } from 'src/core/models';
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
  });
};
