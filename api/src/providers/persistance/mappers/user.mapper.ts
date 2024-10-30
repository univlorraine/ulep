import * as Prisma from '@prisma/client';
import { Gender, MediaObject, Role, User, UserStatus } from 'src/core/models';
import {
  deviceMapper,
  DeviceSnapshot,
} from 'src/providers/persistance/mappers/device.mapper';
import {
  universityMapper,
  UniversityRelations,
  UniversitySnapshot,
} from './university.mapper';

export const UserRelations = {
  Contact: true,
  Organization: { include: UniversityRelations },
  Nationality: true,
  Avatar: true,
  Devices: true,
};

export type UserSnapshot = Prisma.Users & {
  Contact: Prisma.Contacts;
  Organization: UniversitySnapshot;
  Nationality?: Prisma.CountryCodes;
  Avatar: Prisma.MediaObjects;
  Devices?: DeviceSnapshot[];
};

export const userMapper = (snapshot: UserSnapshot): User => {
  return new User({
    id: snapshot.id,
    email: snapshot.email,
    firstname: snapshot.firstname,
    lastname: snapshot.lastname,
    gender: snapshot.gender as Gender,
    age: snapshot.age,
    country: snapshot.Nationality,
    role: snapshot.role as Role,
    university: universityMapper(snapshot.Organization),
    avatar:
      snapshot.Avatar &&
      new MediaObject({
        id: snapshot.Avatar.id,
        name: snapshot.Avatar.name,
        bucket: snapshot.Avatar.bucket,
        mimetype: snapshot.Avatar.mime,
        size: snapshot.Avatar.size,
      }),
    diploma: snapshot.diploma,
    division: snapshot.division,
    staffFunction: snapshot.staff_function,
    status: snapshot.status as UserStatus,
    acceptsEmail: snapshot.accepts_email,
    deactivated: snapshot.deactivated,
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
    devices: snapshot.Devices && snapshot.Devices.map(deviceMapper),
    contactId: snapshot.Contact?.id,
  });
};
