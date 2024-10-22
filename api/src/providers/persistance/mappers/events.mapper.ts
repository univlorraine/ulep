import * as Prisma from '@prisma/client';
import { MediaObject } from 'src/core/models';
import {
  EventObject,
  EventStatus,
  EventTranslation,
  EventType,
} from 'src/core/models/event.model';
import { languageMapper, LanguageSnapshot } from './language.mapper';
import {
  TextContentRelations,
  TextContentSnapshot,
} from './translation.mapper';
import {
  universityMapper,
  UniversityRelations,
  UniversitySnapshot,
} from './university.mapper';
import { userMapper, UserRelations, UserSnapshot } from './user.mapper';

export const EventRelations = {
  AuthorUniversity: { include: UniversityRelations },
  ConcernedUniversities: { include: UniversityRelations },
  DiffusionLanguages: true,
  EnrolledUsers: { include: UserRelations },
  Image: true,
  TitleTextContent: TextContentRelations,
  ContentTextContent: TextContentRelations,
};

export type EventSnapshot = Prisma.Events & {
  AuthorUniversity: UniversitySnapshot;
  ConcernedUniversities: UniversitySnapshot[];
  DiffusionLanguages: LanguageSnapshot[];
  EnrolledUsers: UserSnapshot[];
  Image: Prisma.MediaObjects;
  TitleTextContent: TextContentSnapshot;
  ContentTextContent: TextContentSnapshot;
};

export const eventMapper = (snapshot: EventSnapshot): EventObject => {
  return {
    id: snapshot.id,
    authorUniversity: universityMapper(snapshot.AuthorUniversity),
    image:
      snapshot.Image &&
      new MediaObject({
        id: snapshot.Image.id,
        name: snapshot.Image.name,
        bucket: snapshot.Image.bucket,
        mimetype: snapshot.Image.mime,
        size: snapshot.Image.size,
      }),
    imageCredit: snapshot.image_credit,
    title: snapshot.TitleTextContent.text,
    content: snapshot.ContentTextContent.text,
    languageCode: snapshot.TitleTextContent.LanguageCode.code,
    translations: eventTranslationsMapper(snapshot),
    status: EventStatus[snapshot.status],
    startDate: snapshot.start_date,
    endDate: snapshot.end_date,
    type: EventType[snapshot.type],
    eventURL: snapshot.event_url,
    address: snapshot.address,
    addressName: snapshot.address_name,
    deepLink: snapshot.deep_link,
    withSubscription: snapshot.with_subscription,
    enrolledUsers: snapshot.EnrolledUsers.map(userMapper),
    diffusionLanguages: snapshot.DiffusionLanguages.map(languageMapper),
    concernedUniversities: snapshot.ConcernedUniversities.map(universityMapper),
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
  };
};

export const eventTranslationsMapper = (
  snapshot: EventSnapshot,
): EventTranslation[] => {
  const translations: EventTranslation[] = [];
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
