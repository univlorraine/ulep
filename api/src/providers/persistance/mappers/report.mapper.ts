import * as Prisma from '@prisma/client';
import { Report } from '../../../core/models/report';

export const reportMapper = (
  instance: Prisma.Report & { category: Prisma.ReportCategory },
): Report => {
  return new Report({
    id: instance.id,
    content: instance.content,
    category: {
      id: instance.category.id,
      name: instance.category.name,
    },
    ownerId: instance.userId,
  });
};
