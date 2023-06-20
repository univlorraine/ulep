import * as Prisma from '@prisma/client';
import { Profile } from 'src/core/models/profile';
import { universityMapper } from './university.mapper';
import { countryMapper } from './country.mapper';
import MediaObject from 'src/core/models/media-object';

type ProfileEntity = Prisma.Profile & {
  organization: Prisma.Organization & { country: Prisma.CountryCode };
  nationality: Prisma.CountryCode;
  languages: Prisma.Language[];
  avatar: Prisma.MediaObject;
};

export const profileMapper = (instance: ProfileEntity): Profile => {
  return new Profile({
    id: instance.id,
    email: instance.email,
    firstname: instance.firstname,
    lastname: instance.lastname,
    birthdate: instance.birthdate,
    role: instance.role,
    gender: instance.gender,
    university: universityMapper(instance.organization),
    nationality: countryMapper(instance.nationality),
    goals: instance.metadata['goals'],
    meetingFrequency: instance.metadata['meetingFrequency'],
    bios: instance.metadata['bios'],
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
