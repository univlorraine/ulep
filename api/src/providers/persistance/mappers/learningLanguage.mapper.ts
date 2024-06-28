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
import { UserRelations } from './user.mapper';
import { TextContentRelations } from './translation.mapper';

export const LearningLanguageRelations = {
  Profile: {
    include: {
      User: {
        include: UserRelations,
      },
      Goals: {
        include: { TextContent: TextContentRelations },
      },
      Interests: {
        include: {
          TextContent: TextContentRelations,
          Category: { include: { TextContent: TextContentRelations } },
        },
      },
      NativeLanguage: true,
      MasteredLanguages: { include: { LanguageCode: true } },
      TestedLanguages: {
        include: {
          LanguageCode: true,
        },
      },
      LearningLanguages: {
        include: {
          LanguageCode: true,
          Tandem: true,
          Campus: true,
        },
      },
    },
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
    updatedAt: instance.updated_at,
    learningType: LearningType[instance.learning_type],
    sameAge: Boolean(instance.same_age),
    sameGender: Boolean(instance.same_gender),
    sameTandemEmail: instance.same_tandem_email,
    campus: instance.Campus && campusMapper(instance.Campus),
    certificateOption: Boolean(instance.certificate_option),
    specificProgram: Boolean(instance.specific_program),
    hasPriority: Boolean(instance.has_priority),
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
    ...learningLanguageMapper(instance),
    tandem:
      instance.Tandem &&
      new Tandem({
        id: instance.Tandem.id,
        status: TandemStatus[instance.Tandem.status],
        compatibilityScore: instance.Tandem.compatibilityScore / 100,
      }),
  });
};
