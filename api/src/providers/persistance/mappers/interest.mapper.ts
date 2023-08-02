import * as Prisma from '@prisma/client';
import {
  TextContentRelations,
  TextContentSnapshot,
  textContentMapper,
} from './translation.mapper';
import { Interest } from 'src/core/models';

export const IterestsRelations = {
  TextContent: TextContentRelations,
  Category: { include: { TextContent: TextContentRelations } },
};

export type InterestSnapshot = Prisma.Interests & {
  TextContent: TextContentSnapshot;
  Category: Prisma.ReportCategories & { TextContent: TextContentSnapshot };
};

export const interestMapper = (snapshot: InterestSnapshot): Interest => {
  return {
    id: snapshot.id,
    name: textContentMapper(snapshot.TextContent),
  };
};
