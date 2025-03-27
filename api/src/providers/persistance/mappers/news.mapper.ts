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
