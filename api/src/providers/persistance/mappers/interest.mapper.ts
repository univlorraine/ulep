import * as Prisma from '@prisma/client';
import {
  TextContentRelations,
  TextContentSnapshot,
  textContentMapper,
} from './translation.mapper';
import { InterestCategory, Interest } from 'src/core/models';

export const InterestCategoryRelations = {
  TextContent: TextContentRelations,
  Interests: { include: { TextContent: TextContentRelations } },
};

export const InterestsRelations = {
  TextContent: TextContentRelations,
  Category: { include: { TextContent: TextContentRelations } },
};

export type InterestCategorySnapshot = Prisma.InterestCategories & {
  Interests: Prisma.Interests[];
  TextContent: TextContentSnapshot;
};

export type InterestSnapshot = Prisma.Interests & {
  TextContent: TextContentSnapshot;
  Category: Prisma.ReportCategories & { TextContent: TextContentSnapshot };
};

export const interestCategoryMapper = (
  snapshot: InterestCategorySnapshot,
): InterestCategory => {
  return {
    id: snapshot.id,
    name: textContentMapper(snapshot.TextContent),
    interests: snapshot.Interests.map(interestMapper),
  };
};

export const interestMapper = (snapshot: InterestSnapshot): Interest => {
  return {
    id: snapshot.id,
    category: snapshot.category_id,
    name: textContentMapper(snapshot.TextContent),
  };
};
