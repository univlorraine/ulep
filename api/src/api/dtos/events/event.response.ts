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

import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import {
  EventObject,
  EventTranslation,
  EventType,
} from 'src/core/models/event.model';
import { LanguageResponse } from '../languages';
import { ProfileResponse } from '../profiles';
import { UniversityResponse } from '../universities';
import { UserResponse } from '../users';
export class EventTranslationResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  languageCode: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  constructor(partial: Partial<EventTranslationResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: EventTranslation) {
    return new EventTranslationResponse({
      languageCode: instance.languageCode,
      title: instance.title,
      content: instance.content,
    });
  }
}

export class EventResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiProperty({ type: [EventTranslationResponse] })
  @Expose({ groups: ['read'] })
  @IsArray()
  translations: EventTranslationResponse[];

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  languageCode: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  authorUniversity: UniversityResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  type: EventType;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  eventURL?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  address?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  addressName?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  deepLink?: string;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  withSubscription: boolean;

  @Swagger.ApiProperty({ type: [LanguageResponse] })
  @Expose({ groups: ['read'] })
  @IsArray()
  diffusionLanguages?: LanguageResponse[];

  @Swagger.ApiProperty({ type: [UniversityResponse] })
  @Expose({ groups: ['event:admin'] })
  @IsArray()
  concernedUniversities?: UniversityResponse[];

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  status: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  imageURL?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  imageCredit?: string;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  startDate: Date;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  endDate: Date;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['event:front'] })
  isUserSubscribed: boolean;

  @Swagger.ApiProperty({ type: [UserResponse] })
  @Expose({ groups: ['event:subscribedProfiles'] })
  @IsArray()
  subscribedProfiles: ProfileResponse[];

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'Date' })
  @Expose({ groups: ['read'] })
  updatedAt: Date;

  constructor(partial: Partial<EventResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: EventObject, profileId?: string) {
    return new EventResponse({
      id: instance.id,
      title: instance.title,
      content: instance.content,
      type: instance.type,
      status: instance.status,
      eventURL: instance.eventURL,
      address: instance.address,
      addressName: instance.addressName,
      deepLink: instance.deepLink,
      withSubscription: instance.withSubscription,
      diffusionLanguages: instance.diffusionLanguages?.map((language) =>
        LanguageResponse.fromLanguage(language),
      ),
      concernedUniversities: instance.concernedUniversities?.map((university) =>
        UniversityResponse.fromUniversity(university),
      ),
      imageURL: instance.imageURL,
      imageCredit: instance.imageCredit,
      languageCode: instance.languageCode,
      translations: instance.translations.map(
        EventTranslationResponse.fromDomain,
      ),
      authorUniversity: UniversityResponse.fromUniversity(
        instance.authorUniversity,
      ),
      startDate: instance.startDate,
      endDate: instance.endDate,
      subscribedProfiles: instance.subscribedProfiles?.map((profile) =>
        ProfileResponse.fromDomain(profile),
      ),
      isUserSubscribed: profileId
        ? instance.isUserSubscribed(profileId)
        : undefined,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    });
  }
}
