import * as Prisma from '@prisma/client';
import {
  TextContentRelations,
  TextContentSnapshot,
  textContentMapper,
} from './translation.mapper';
import { Report, ReportCategory, ReportStatus } from 'src/core/models';
import {
  UserRelations,
  UserSnapshot,
  userMapper,
} from 'src/providers/persistance/mappers/user.mapper';

export const ReportRelations = {
  User: { include: UserRelations },
  Category: {
    include: {
      TextContent: TextContentRelations,
    },
  },
};

export type ReportCategorySnapshot = Prisma.ReportCategories & {
  TextContent: Prisma.TextContent & TextContentSnapshot;
};

export type ReportSnapshot = Prisma.Reports & {
  Category: ReportCategorySnapshot;
  User: UserSnapshot;
};

export const reportCategoryMapper = (
  snapshot: ReportCategorySnapshot,
): ReportCategory => {
  return {
    id: snapshot.id,
    name: textContentMapper(snapshot.TextContent),
  };
};

export const reportMapper = (snapshot: ReportSnapshot): Report => {
  return new Report({
    id: snapshot.id,
    category: {
      id: snapshot.Category.id,
      name: textContentMapper(snapshot.Category.TextContent),
    },
    status: ReportStatus[snapshot.status],
    content: snapshot.content,
    user: userMapper(snapshot.User),
    createdAt: snapshot.createdAt,
  });
};
