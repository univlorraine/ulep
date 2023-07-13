import * as Prisma from '@prisma/client';
import { CEFRLevel, Gender, Profile, Role } from '../../../core/models/profile';
import { universityMapper } from './university.mapper';
import { countryMapper } from './country.mapper';
import MediaObject from '../../../core/models/media-object';
import { userMapper } from './user.mapper';
import { languageMapper } from './language.mapper';

type ProfileEntity = Prisma.Profile & {
  user: Prisma.User;
  university: Prisma.University & {
    country: Prisma.Country;
  };
  nationality: Prisma.Country;
  avatar: Prisma.MediaObject;
  nativeLanguage: Prisma.Language;
  learningLanguage: Prisma.Language;
  masteredLanguages: (Prisma.MasteredLanguage & {
    language: Prisma.Language;
  })[];
};

export const profileMapper = (instance: ProfileEntity): Profile => {
  return new Profile({
    id: instance.id,
    user: userMapper(instance.user),
    firstname: instance.firstname,
    lastname: instance.lastname,
    age: instance.age,
    role: Role[instance.role],
    gender: Gender[instance.gender],
    university: universityMapper(instance.university),
    nationality: countryMapper(instance.nationality),
    nativeLanguage: instance.nativeLanguage,
    masteredLanguages: instance.masteredLanguages.map((language) =>
      languageMapper(language.language),
    ),
    learningLanguage: instance.learningLanguage,
    learningLanguageLevel: instance.learningLanguageLevel as CEFRLevel,
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
