import * as Prisma from '@prisma/client';
import { User } from '../../../core/models/user';

export const userMapper = (instance: Prisma.User): User => {
  return new User({
    id: instance.id,
    email: instance.email,
  });
};
