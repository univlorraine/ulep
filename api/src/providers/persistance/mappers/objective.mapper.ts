import * as Prisma from '@prisma/client';
import { LearningObjective, MediaObject } from 'src/core/models';
import {
  TextContentRelations,
  TextContentSnapshot,
  textContentMapper,
} from 'src/providers/persistance/mappers/translation.mapper';

export const ObjectivesRelations = {
  TextContent: TextContentRelations,
  Image: true,
};

export type ObjectiveSnapshot = Prisma.LearningObjectives & {
  Image: Prisma.MediaObjects;
  TextContent: TextContentSnapshot;
};

export const objectiveMapper = (
  snapshot: ObjectiveSnapshot,
): LearningObjective => {
  return {
    id: snapshot.id,
    image:
      snapshot.Image &&
      new MediaObject({
        id: snapshot.Image.id,
        name: snapshot.Image.name,
        bucket: snapshot.Image.bucket,
        mimetype: snapshot.Image.mime,
        size: snapshot.Image.size,
      }),
    name: textContentMapper(snapshot.TextContent),
  };
};
