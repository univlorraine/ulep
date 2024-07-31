import * as Prisma from '@prisma/client';
import { ProfilesRelations } from './profile.mapper';
import { userMapper, UserRelations, UserSnapshot } from './user.mapper';
import { languageMapper } from './language.mapper';
import {
  LearningLanguage,
  LearningType,
  ProficiencyLevel,
} from 'src/core/models';
import { campusMapper } from './campus.mapper';
import { tandemMapper } from './tandem.mapper';
import { ProfileWithTandemsProfiles } from 'src/core/models/profileWithTandemsProfiles.model';

export type ProfileWithTandemsProfilesSnapshot = Prisma.Profiles & {
  User: UserSnapshot;
  NativeLanguage: Prisma.LanguageCodes;
  LearningLanguages: (Prisma.LearningLanguages & {
    LanguageCode: Prisma.LanguageCodes;
    Campus: Prisma.Places;
    Tandem: Prisma.Tandems;
  })[];
  MasteredLanguages: (Prisma.MasteredLanguages & {
    LanguageCode: Prisma.LanguageCodes;
  })[];
};

export const ProfilesRelationsWithTandemProfile = {
  User: {
    include: UserRelations,
  },
  NativeLanguage: true,
  MasteredLanguages: { include: { LanguageCode: true } },
  LearningLanguages: {
    include: {
      LanguageCode: true,
      Tandem: {
        include: {
          LearningLanguages: {
            include: {
              Profile: {
                include: ProfilesRelations,
              },
              LanguageCode: true,
              Campus: true,
              TandemLanguage: true,
            },
          },
          UniversityValidations: true,
        },
      },
      Campus: true,
    },
  },
};

export const profileWithTandemsProfilesMapper = (
  instance: ProfileWithTandemsProfilesSnapshot,
): ProfileWithTandemsProfiles => {
  const availabilities = JSON.parse(instance.availabilities as string);
  return new ProfileWithTandemsProfiles({
    id: instance.id,
    user: userMapper(instance.User),
    nativeLanguage: languageMapper(instance.NativeLanguage),
    masteredLanguages: instance.MasteredLanguages.map((language) =>
      languageMapper(language.LanguageCode),
    ),
    learningLanguages: instance.LearningLanguages.map(
      (learningLanguage) =>
        new LearningLanguage({
          id: learningLanguage.id,
          createdAt: learningLanguage.created_at,
          updatedAt: learningLanguage.updated_at,
          level: ProficiencyLevel[learningLanguage.level],
          language: languageMapper(learningLanguage.LanguageCode),
          learningType: LearningType[learningLanguage.learning_type],
          sameAge: learningLanguage.same_age,
          sameGender: learningLanguage.same_gender,
          hasPriority: learningLanguage.has_priority,
          campus:
            learningLanguage.Campus && campusMapper(learningLanguage.Campus),
          tandem:
            learningLanguage.Tandem && tandemMapper(learningLanguage.Tandem),
          certificateOption: learningLanguage.certificate_option,
          specificProgram: learningLanguage.specific_program,
        }),
    ),
    createdAt: instance.created_at,
    updatedAt: instance.updated_at,
  });
};
