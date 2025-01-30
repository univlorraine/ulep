import * as Prisma from '@prisma/client';
import {
  MediaObject,
  News,
  NewsStatus,
  NewsTranslation,
} from 'src/core/models';
import {
  TextContentRelations,
  TextContentSnapshot,
} from './translation.mapper';
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
  ConcernedUniversities: { include: UniversityRelations },
};

export type NewsSnapshot = Prisma.News & {
  Organization: UniversitySnapshot;
  Image: Prisma.MediaObjects;
  TitleTextContent: TextContentSnapshot;
  ContentTextContent: TextContentSnapshot;
  ConcernedUniversities: UniversitySnapshot[];
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
    title: snapshot.TitleTextContent.text,
    content: snapshot.ContentTextContent.text,
    languageCode: snapshot.TitleTextContent.LanguageCode.code,
    translations: newsTranslationsMapper(snapshot),
    status: newsStatusMapper(snapshot.status),
    startPublicationDate: snapshot.start_publication_date,
    endPublicationDate: snapshot.end_publication_date,
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
    creditImage: snapshot.credit_image,
    concernedUniversities: snapshot.ConcernedUniversities.map((university) =>
      universityMapper(university),
    ),
  };
};

export const newsTranslationsMapper = (
  snapshot: NewsSnapshot,
): NewsTranslation[] => {
  const translations: NewsTranslation[] = [];
  snapshot.TitleTextContent.Translations.forEach((titleTranslation) => {
    translations.push({
      languageCode: titleTranslation.LanguageCode.code,
      title: titleTranslation.text,
      content: snapshot.ContentTextContent.Translations.find(
        (contentTranslation) =>
          contentTranslation.LanguageCode.code ===
          titleTranslation.LanguageCode.code,
      ).text,
    });
  });

  return translations;
};
export const newsStatusMapper = (status: string): NewsStatus => {
  if (Object.values(NewsStatus).includes(status as NewsStatus)) {
    return status as NewsStatus;
  }

  return NewsStatus.DRAFT;
};
