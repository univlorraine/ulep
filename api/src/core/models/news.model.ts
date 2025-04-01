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

import { MediaObject } from './media.model';
import { University } from './university.model';

export enum NewsStatus {
  DRAFT = 'DRAFT',
  READY = 'READY',
}

export interface NewsTranslation {
  languageCode: string;
  content: string;
  title: string;
}

export interface NewsProps {
  id: string;
  title: string;
  content: string;
  university: University;
  image?: MediaObject;
  imageURL?: string;
  creditImage?: string;
  translations: NewsTranslation[];
  languageCode: string;
  startPublicationDate: Date;
  endPublicationDate: Date;
  createdAt: Date;
  updatedAt: Date;
  status: NewsStatus;
  concernedUniversities: University[];
}

export class News {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly translations: NewsTranslation[];
  readonly languageCode: string;
  readonly image?: MediaObject;
  imageURL?: string;
  readonly creditImage?: string;
  readonly university: University;
  readonly startPublicationDate: Date;
  readonly endPublicationDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly status: NewsStatus;
  readonly concernedUniversities: University[];

  constructor({
    id,
    title,
    content,
    image,
    imageURL,
    translations,
    languageCode,
    university,
    startPublicationDate,
    endPublicationDate,
    createdAt,
    updatedAt,
    status,
    creditImage,
    concernedUniversities,
  }: NewsProps) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.image = image;
    this.imageURL = imageURL;
    this.translations = translations;
    this.languageCode = languageCode;
    this.university = university;
    this.startPublicationDate = startPublicationDate;
    this.endPublicationDate = endPublicationDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    this.creditImage = creditImage;
    this.concernedUniversities = concernedUniversities;
  }
}
