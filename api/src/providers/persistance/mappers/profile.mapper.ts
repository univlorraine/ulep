import * as Prisma from '@prisma/client';
import { CEFRLevel, Profile } from '../../../core/models/profile';
import { universityMapper } from './university.mapper';
import { countryMapper } from './country.mapper';
import MediaObject from '../../../core/models/media-object';
import { userMapper } from './user.mapper';

type ProfileEntity = Prisma.Profile & {
  user: Prisma.User;
  organization: Prisma.Organization & {
    country: Prisma.CountryCode;
  };
  nationality: Prisma.CountryCode;
  learningLanguage: Prisma.LearningLanguage & {
    languageCode: Prisma.LanguageCode;
  };
  nativeLanguage: Prisma.NativeLanguage & {
    languageCode: Prisma.LanguageCode;
  };
  avatar: Prisma.MediaObject;
};

export const profileMapper = (instance: ProfileEntity): Profile => {
  return new Profile({
    id: instance.id,
    user: userMapper(instance.user),
    firstname: instance.firstname,
    lastname: instance.lastname,
    birthdate: instance.birthdate,
    role: instance.role,
    gender: instance.gender,
    university: universityMapper(instance.organization),
    nationality: countryMapper(instance.nationality),
    learningLanguage: {
      id: instance.learningLanguage.id,
      code: instance.learningLanguage.languageCode.code,
      level: instance.learningLanguage.proficiencyLevel as CEFRLevel,
    },
    nativeLanguage: {
      id: instance.nativeLanguage.id,
      code: instance.nativeLanguage.languageCode.code,
    },
    goals: new Set(instance.metadata['goals']),
    interests: new Set(instance.metadata['interests']),
    bios: instance.metadata['bios'],
    preferences: {
      meetingFrequency: instance.metadata['meetingFrequency'],
      sameGender: instance.metadata['preferSameGender'] ?? false,
    },
    avatar: instance.avatar
      ? new MediaObject({
          id: instance.avatar.id,
          name: instance.avatar.name,
          bucket: instance.avatar.bucket,
          mimetype: instance.avatar.mime,
          size: instance.avatar.size,
        })
      : null,
  });
};
