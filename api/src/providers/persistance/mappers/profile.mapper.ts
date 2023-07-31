import * as Prisma from '@prisma/client';
import { LearningType, ProficiencyLevel, Profile } from 'src/core/models';
import {
  TextContentRelations,
  TextContentSnapshot,
  textContentMapper,
} from './translation.mapper';
import { UserRelations, UserSnapshot, userMapper } from './user.mapper';

export const ProfilesRelations = {
  User: {
    include: UserRelations,
  },
  Goals: true,
  Interests: {
    include: {
      TextContent: TextContentRelations,
      Category: { include: { TextContent: TextContentRelations } },
    },
  },
  NativeLanguage: true,
  LearningLanguage: true,
  MasteredLanguages: { include: { LanguageCode: true } },
};

export type ProfileSnapshot = Prisma.Profiles & {
  User: UserSnapshot;
  Goals: Prisma.Goals[];
  Interests: (Prisma.Interests & {
    TextContent: TextContentSnapshot;
    Category: Prisma.InterestCategories & { TextContent: TextContentSnapshot };
  })[];
  NativeLanguage: Prisma.LanguageCodes;
  LearningLanguage: Prisma.LanguageCodes;
  MasteredLanguages: (Prisma.MasteredLanguages & {
    LanguageCode: Prisma.LanguageCodes;
  })[];
};

export const profileMapper = (instance: ProfileSnapshot): Profile => {
  return new Profile({
    id: instance.id,
    user: userMapper(instance.User),
    languages: {
      native: {
        id: instance.NativeLanguage.id,
        code: instance.NativeLanguage.code,
      },
      mastered: instance.MasteredLanguages.map((language) => ({
        id: language.LanguageCode.id,
        code: language.LanguageCode.code,
      })),
      learning: {
        id: instance.LearningLanguage.id,
        code: instance.LearningLanguage.code,
        level: ProficiencyLevel[instance.level],
      },
    },
    preferences: {
      learningType: LearningType[instance.learning_type],
      meetingFrequency: instance.meeting_frequency,
      sameAge: instance.same_age,
      sameGender: instance.same_gender,
      goals: [], // TODO: Fix this
    },
    interests: instance.Interests.map((interest) => ({
      id: interest.id,
      name: textContentMapper(interest.TextContent),
      category: {
        id: interest.Category.id,
        name: textContentMapper(interest.Category.TextContent),
      },
    })),
  });
};
