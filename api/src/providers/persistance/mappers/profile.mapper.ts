import * as Prisma from '@prisma/client';
import { LearningType, ProficiencyLevel, Profile } from 'src/core/models';
import {
  TextContentRelations,
  TextContentSnapshot,
  textContentMapper,
} from './translation.mapper';
import { UserRelations, UserSnapshot, userMapper } from './user.mapper';
import { languageMapper } from './language.mapper';
import { campusMapper } from './campus.mapper';

export const ProfilesRelations = {
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
  LearningLanguages: { include: { LanguageCode: true } },
  Campus: true,
};

export type ProfileSnapshot = Prisma.Profiles & {
  User: UserSnapshot;
  Goals: (Prisma.LearningObjectives & {
    TextContent: TextContentSnapshot;
  })[];
  Interests: (Prisma.Interests & {
    TextContent: TextContentSnapshot;
    Category: Prisma.InterestCategories & { TextContent: TextContentSnapshot };
  })[];
  NativeLanguage: Prisma.LanguageCodes;
  LearningLanguages: (Prisma.LearningLanguages & {
    LanguageCode: Prisma.LanguageCodes;
  })[];
  MasteredLanguages: (Prisma.MasteredLanguages & {
    LanguageCode: Prisma.LanguageCodes;
  })[];
  Campus: Prisma.Places;
};

export const profileMapper = (instance: ProfileSnapshot): Profile => {
  return new Profile({
    id: instance.id,
    user: userMapper(instance.User),
    nativeLanguage: {
      id: instance.NativeLanguage.id,
      code: instance.NativeLanguage.code,
    },
    masteredLanguages: instance.MasteredLanguages.map((language) => ({
      id: language.LanguageCode.id,
      code: language.LanguageCode.code,
    })),
    learningLanguages: instance.LearningLanguages.map((learningLanguage) => ({
      level: ProficiencyLevel[learningLanguage.level],
      language: languageMapper(learningLanguage.LanguageCode),
    })),
    learningType: LearningType[instance.learning_type],
    meetingFrequency: instance.meeting_frequency,
    sameAge: instance.same_age,
    sameGender: instance.same_gender,
    objectives: instance.Goals.map((objective) => ({
      id: objective.id,
      name: textContentMapper(objective.TextContent),
    })),
    interests: instance.Interests.map((interest) => ({
      id: interest.id,
      name: textContentMapper(interest.TextContent),
      category: {
        id: interest.Category.id,
        name: textContentMapper(interest.Category.TextContent),
      },
    })),
    biography: {
      superpower: instance.bio['superpower'],
      favoritePlace: instance.bio['favoritePlace'],
      experience: instance.bio['experience'],
      anecdote: instance.bio['anecdote'],
    },
    campus: instance.Campus && campusMapper(instance.Campus),
  });
};
