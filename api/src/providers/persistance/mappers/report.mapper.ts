import * as Prisma from '@prisma/client';
import { Report } from '../../../core/models/report';
import { userMapper } from './user.mapper';

export const reportMapper = (
  instance: Prisma.Report & {
    user: Prisma.User;
    category: Prisma.ReportCategory;
  },
): Report => {
  return new Report({
    id: instance.id,
    content: instance.content,
    category: {
      id: instance.category.id,
      name: instance.category.name,
    },
    owner: userMapper(instance.user),
  });
};
