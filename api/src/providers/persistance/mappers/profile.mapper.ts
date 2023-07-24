import * as Prisma from '@prisma/client';
import {
  CEFRLevel,
  Gender,
  LearningType,
  Profile,
  Role,
} from '../../../core/models/profile';
import { UniversitySnapshot, universityMapper } from './university.mapper';
import { userMapper } from './user.mapper';

type ProfileEntity = Prisma.Profile & {
  user: Prisma.User;
  university: UniversitySnapshot;
  nativeLanguage: Prisma.Language;
  learningLanguage: Prisma.Language;
  masteredLanguages: (Prisma.MasteredLanguage & {
    language: Prisma.Language;
  })[];
  preferences: Prisma.LearningPreference;
};

export const profileMapper = (instance: ProfileEntity): Profile => {
  return new Profile({
    id: instance.id,
    user: userMapper(instance.user),
    role: Role[instance.role],
    university: universityMapper(instance.university),
    personalInformation: {
      age: instance.age,
      gender: Gender[instance.gender],
      interests: instance.metadata['interests'],
      bio: instance.metadata['bios'],
    },
    languages: {
      nativeLanguage: instance.nativeLanguageCode,
      masteredLanguages: instance.masteredLanguages.map(
        (language) => language.languageCode,
      ),
      learningLanguage: instance.learningLanguageCode,
      learningLanguageLevel: instance.learningLanguageLevel as CEFRLevel,
    },
    preferences: {
      learningType: instance.preferences.type as LearningType,
      meetingFrequency: instance.metadata['frequency'],
      sameGender: instance.preferences.sameGender,
      goals: instance.metadata['goals'],
    },
  });
};
