import * as Prisma from '@prisma/client';
import {
  LearningLanguage,
  LearningLanguageWithTandem,
  LearningType,
  MediaObject,
  ProficiencyLevel,
  Tandem,
  TandemStatus,
} from 'src/core/models';
import { campusMapper } from './campus.mapper';
import { customLearningGoalMapper } from './customLearningGoal.mapper';
import { languageMapper } from './language.mapper';
import { profileMapper, ProfileSnapshot } from './profile.mapper';
import { TextContentRelations } from './translation.mapper';
import { UserRelations } from './user.mapper';

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
          CertificateFile: true,
          CustomLearningGoals: true,
        },
      },
    },
  },
  LanguageCode: true,
  Campus: true,
  TandemLanguage: true,
  CertificateFile: true,
  CustomLearningGoals: true,
};

export type LearningLanguageSnapshot = Prisma.LearningLanguages & {
  Profile: ProfileSnapshot;
  LanguageCode: Prisma.LanguageCodes;
  Campus: Prisma.Places;
  TandemLanguage?: Prisma.LanguageCodes;
  CertificateFile?: Prisma.MediaObjects;
  CustomLearningGoals: Prisma.CustomLearningGoals[];
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
    learningJournal: instance.learning_journal ?? false,
    consultingInterview: instance.consulting_interview ?? false,
    sharedCertificate: instance.shared_certificate ?? false,
    sharedLogsDate: instance.shared_logs_date
      ? new Date(instance.shared_logs_date)
      : undefined,
    certificateFile:
      instance.CertificateFile &&
      new MediaObject({
        id: instance.CertificateFile.id,
        name: instance.CertificateFile.name,
        bucket: instance.CertificateFile.bucket,
        mimetype: instance.CertificateFile.mime,
        size: instance.CertificateFile.size,
      }),
    tandemLanguage:
      instance.TandemLanguage && languageMapper(instance.TandemLanguage),
    customLearningGoals:
      instance.CustomLearningGoals &&
      instance.CustomLearningGoals.map(customLearningGoalMapper),
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
        learningType: LearningType[instance.Tandem.learning_type],
      }),
  });
};
