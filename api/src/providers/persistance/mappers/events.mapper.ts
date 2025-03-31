/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
  profileMapper,
  ProfileSnapshot,
  ProfilesRelations,
} from './profile.mapper';
import {
  TextContentRelations,
  TextContentSnapshot,
} from './translation.mapper';
import {
  universityMapper,
  UniversityRelations,
  UniversitySnapshot,
} from './university.mapper';

export const EventRelations = {
  AuthorUniversity: { include: UniversityRelations },
  ConcernedUniversities: { include: UniversityRelations },
  DiffusionLanguages: true,
  SubscribedProfiles: { include: ProfilesRelations },
  Image: true,
  TitleTextContent: TextContentRelations,
  ContentTextContent: TextContentRelations,
};

export type EventSnapshot = Prisma.Events & {
  AuthorUniversity: UniversitySnapshot;
  ConcernedUniversities: UniversitySnapshot[];
  DiffusionLanguages: LanguageSnapshot[];
  SubscribedProfiles: ProfileSnapshot[];
  Image: Prisma.MediaObjects;
  TitleTextContent: TextContentSnapshot;
  ContentTextContent: TextContentSnapshot;
};

export const eventMapper = (snapshot: EventSnapshot): EventObject => {
  return new EventObject({
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
    subscribedProfiles: snapshot.SubscribedProfiles.map(profileMapper),
    diffusionLanguages: snapshot.DiffusionLanguages.map(languageMapper),
    concernedUniversities: snapshot.ConcernedUniversities.map(universityMapper),
    createdAt: snapshot.created_at,
    updatedAt: snapshot.updated_at,
  });
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
