import * as Prisma from '@prisma/client';
import { Role, User } from '../../../core/models/user';

export const userMapper = (instance: Prisma.UserEntity): User => {
  return new User({
    id: instance.id,
    email: instance.email,
    roles: instance.roles.map((role) => Role[role]),
  });
};
