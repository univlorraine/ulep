import * as Prisma from '@prisma/client';
import { User } from '../../../core/models/user';

export const userMapper = (instance: Prisma.User): User => {
  return new User({
    id: instance.id,
    email: instance.email,
    firstname: instance.firstname,
    lastname: instance.lastname,
    // avatar:
    //   instance.avatar &&
    //   new MediaObject({
    //     id: instance.avatar.id,
    //     name: instance.avatar.name,
    //     bucket: instance.avatar.bucket,
    //     mimetype: instance.avatar.mime,
    //     size: instance.avatar.size,
    //   }),
  });
};
