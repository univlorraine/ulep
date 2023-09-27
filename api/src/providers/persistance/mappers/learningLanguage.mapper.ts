import * as Prisma from '@prisma/client';
import {
  ProfileSnapshot,
  ProfilesRelations,
  profileMapper,
} from './profile.mapper';
import {
  LearningLanguage,
  LearningLanguageWithTandem,
  LearningType,
  ProficiencyLevel,
  Tandem,
  TandemStatus,
} from 'src/core/models';
import { languageMapper } from './language.mapper';
import { campusMapper } from './campus.mapper';

export const LearningLanguageRelations = {
  Profile: {
    include: ProfilesRelations,
  },
  LanguageCode: true,
  Campus: true,
  TandemLanguage: true,
};

export type LearningLanguageSnapshot = Prisma.LearningLanguages & {
  Profile: ProfileSnapshot;
  LanguageCode: Prisma.LanguageCodes;
  Campus: Prisma.Places;
  TandemLanguage?: Prisma.LanguageCodes;
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
    learningType: LearningType[instance.learning_type],
    sameAge: instance.same_age,
    sameGender: instance.same_gender,
    campus: instance.Campus && campusMapper(instance.Campus),
    certificateOption: instance.certificate_option,
    specificProgram: instance.specific_program,
    tandemLanguage:
      instance.TandemLanguage && languageMapper(instance.TandemLanguage),
  });
};

export const LearningLanguageWithTandemRelations = {
  ...LearningLanguageRelations,
  Tandem: true,
  TandemLanguage: true,
};

export type LearningLanguageWithTandemSnapshot = LearningLanguageSnapshot & {
  Tandem: Prisma.Tandems;
  TandemLanguage?: Prisma.LanguageCodes;
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
    learningType: LearningType[instance.learning_type],
    sameAge: instance.same_age,
    sameGender: instance.same_gender,
    campus: instance.Campus && campusMapper(instance.Campus),
    certificateOption: instance.certificate_option,
    specificProgram: instance.specific_program,
    tandem:
      instance.Tandem &&
      new Tandem({
        id: instance.Tandem.id,
        status: TandemStatus[instance.Tandem.status],
        compatibilityScore: instance.Tandem.compatibilityScore / 100,
      }),
    tandemLanguage:
      instance.TandemLanguage && languageMapper(instance.TandemLanguage),
  });
};
