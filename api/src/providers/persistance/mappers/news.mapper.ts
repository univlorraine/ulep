import * as Prisma from '@prisma/client';
import {
  TextContentRelations,
  TextContentSnapshot,
  textContentMapper,
} from './translation.mapper';
import { News, MediaObject } from 'src/core/models';
import {
  universityMapper,
  UniversityRelations,
  UniversitySnapshot,
} from './university.mapper';

export const NewsRelations = {
  Organization: { include: UniversityRelations },
  Image: true,
  TitleTextContent: TextContentRelations,
  ContentTextContent: TextContentRelations,
};

export type NewsSnapshot = Prisma.News & {
  Organization: UniversitySnapshot;
  Image: Prisma.MediaObjects;
  TitleTextContent: TextContentSnapshot;
  ContentTextContent: TextContentSnapshot;
};

export const newsMapper = (snapshot: NewsSnapshot): News => {
  return {
    id: snapshot.id,
    university: universityMapper(snapshot.Organization),
    image:
      snapshot.Image &&
      new MediaObject({
        id: snapshot.Image.id,
        name: snapshot.Image.name,
        bucket: snapshot.Image.bucket,
        mimetype: snapshot.Image.mime,
        size: snapshot.Image.size,
      }),
    title: textContentMapper(snapshot.TitleTextContent),
    content: textContentMapper(snapshot.ContentTextContent),
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
  };
};
