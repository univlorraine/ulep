import * as Prisma from '@prisma/client';
import { MediaObject } from 'src/core/models';
import { Edito, EditoTranslation } from 'src/core/models/edito.model';
import {
  TextContentRelations,
  TextContentSnapshot,
} from './translation.mapper';
import {
  universityMapper,
  UniversityRelations,
  UniversitySnapshot,
} from './university.mapper';

export const EditoRelations = {
  University: { include: UniversityRelations },
  Image: true,
  ContentTextContent: TextContentRelations,
};

export type EditoSnapshot = Prisma.Editos & {
  University: UniversitySnapshot;
  ContentTextContent: TextContentSnapshot;
  Image?: Prisma.MediaObjects;
};

export const editoMapper = (snapshot: EditoSnapshot): Edito => {
  return new Edito({
    id: snapshot.id,
    university: universityMapper(snapshot.University),
    image:
      snapshot.Image &&
      new MediaObject({
        id: snapshot.Image.id,
        name: snapshot.Image.name,
        bucket: snapshot.Image.bucket,
        mimetype: snapshot.Image.mime,
        size: snapshot.Image.size,
      }),
    content: snapshot.ContentTextContent.text,
    languageCode: snapshot.ContentTextContent.LanguageCode.code,
    translations: editoTranslationsMapper(snapshot),
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
  });
};

export const editoTranslationsMapper = (
  snapshot: EditoSnapshot,
): EditoTranslation[] => {
  const translations: EditoTranslation[] = [];
  snapshot.ContentTextContent.Translations.forEach((titleTranslation) => {
    translations.push({
      languageCode: titleTranslation.LanguageCode.code,
      content: snapshot.ContentTextContent.Translations.find(
        (contentTranslation) =>
          contentTranslation.LanguageCode.code ===
          titleTranslation.LanguageCode.code,
      ).text,
    });
  });

  return translations;
};
