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
import { ActivityResponse } from 'src/api/dtos/activity';
import { UserChatResponse } from 'src/api/dtos/chat/user-conversation.response';
import { VocabularyListResponse } from 'src/api/dtos/vocabulary/vocabulary-list.response';
import { MessageWithUser } from 'src/core/ports/chat.service';

class OGImageResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  url: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  type: string;

  constructor(partial: Partial<OGImageResponse>) {
    Object.assign(this, partial);
  }

  static from(ogImage: any): OGImageResponse {
    return new OGImageResponse({
      url: ogImage.url,
      type: ogImage.type,
    });
  }
}
export class OGResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  ogSiteName?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  ogUrl?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  ogLocale?: string;

  @Swagger.ApiProperty({ type: 'array' })
  @Expose({ groups: ['read'] })
  ogImage?: OGImageResponse[];

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  ogTitle?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  ogDescription?: string;

  constructor(partial: Partial<OGResponse>) {
    Object.assign(this, partial);
  }

  static from(metadata: any): OGResponse {
    return new OGResponse({
      ogSiteName: metadata.ogSiteName,
      ogUrl: metadata.ogUrl,
      ogLocale: metadata.ogLocale,
      ogImage:
        metadata.ogImage && metadata.ogImage.length > 0
          ? metadata.ogImage.map(OGImageResponse.from)
          : [],
      ogTitle: metadata.ogTitle,
      ogDescription: metadata.ogDescription,
    });
  }
}
class MetadataMessageResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  originalFilename?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  openGraphResult?: OGResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  thumbnail?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  filePath?: string;

  @Swagger.ApiProperty({ type: 'object' })
  @Expose({ groups: ['read'] })
  vocabularyList?: VocabularyListResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  activity?: ActivityResponse;

  constructor(partial: Partial<MetadataMessageResponse>) {
    Object.assign(this, partial);
  }

  static from(metadata: any, languageCode?: string): MetadataMessageResponse {
    return new MetadataMessageResponse({
      originalFilename: metadata.originalFilename,
      openGraphResult: metadata.openGraphResult
        ? OGResponse.from(metadata.openGraphResult)
        : undefined,
      thumbnail: metadata.thumbnail,
      filePath: metadata.filePath,
      vocabularyList: metadata.vocabularyList
        ? VocabularyListResponse.from(metadata.vocabularyList)
        : undefined,
      activity: metadata.activity
        ? ActivityResponse.from(metadata.activity, languageCode)
        : undefined,
    });
  }
}

export class MessageResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  content: string;

  @Swagger.ApiProperty({ type: UserChatResponse })
  @Expose({ groups: ['read'] })
  user: UserChatResponse;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  type: string;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  likes: number;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  isDeleted: boolean;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  didLike: boolean;

  @Swagger.ApiProperty({ type: 'object' })
  @Expose({ groups: ['read'] })
  metadata: MetadataMessageResponse;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  numberOfReplies: number;

  @Swagger.ApiProperty({ type: MessageResponse })
  @Expose({ groups: ['read'] })
  parent?: MessageResponse;

  constructor(partial: Partial<MessageResponse>) {
    Object.assign(this, partial);
  }

  static from(
    message: MessageWithUser,
    userId: string,
    languageCode?: string,
  ): MessageResponse {
    return new MessageResponse({
      id: message.id,
      createdAt: message.createdAt,
      content: message.content,
      likes: message.likes.length,
      didLike: message.likes.some((like) => like === userId),
      user: UserChatResponse.fromDomain(message.user),
      isDeleted: message.isDeleted,
      type: message.type,
      metadata: MetadataMessageResponse.from(message.metadata, languageCode),
      numberOfReplies: message.numberOfReplies,
      parent: message.parent
        ? MessageResponse.from(message.parent, userId)
        : undefined,
    });
  }
}
