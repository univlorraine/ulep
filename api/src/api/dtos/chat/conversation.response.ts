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
import { MessageResponse } from 'src/api/dtos/chat/message.response';
import { UserChatResponse } from 'src/api/dtos/chat/user-conversation.response';
import { LanguageResponse } from 'src/api/dtos/languages';
import { LearningLanguageResponse } from 'src/api/dtos/learning-languages';
import { UserResponse } from 'src/api/dtos/users';
import { LearningLanguage } from 'src/core/models';
import { ConversationWithUsers } from 'src/core/ports/chat.service';

class MetadataResponse {
  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['chat'] })
  isBlocked: boolean;

  @Swagger.ApiProperty({ type: LearningLanguageResponse, isArray: true })
  @Expose({ groups: ['chat'] })
  learningLanguages: LearningLanguageResponse[];

  @Swagger.ApiProperty({ type: LanguageResponse })
  @Expose({ groups: ['chat'] })
  centralLanguage: LanguageResponse;

  @Swagger.ApiProperty({ type: LanguageResponse })
  @Expose({ groups: ['chat'] })
  partnerLanguage: LanguageResponse;

  constructor(partial: Partial<MetadataResponse>) {
    Object.assign(this, partial);
  }

  static from(metadata: any): MetadataResponse {
    return new MetadataResponse({
      isBlocked: metadata.isBlocked,
      learningLanguages: metadata.learningLanguages?.map(
        (learningLanguage: LearningLanguage) =>
          LearningLanguageResponse.fromDomain({ learningLanguage }),
      ),
      centralLanguage: metadata.centralLanguage
        ? LanguageResponse.fromLanguage(metadata.centralLanguage)
        : undefined,
      partnerLanguage: metadata.partnerLanguage
        ? LanguageResponse.fromLanguage(metadata.partnerLanguage)
        : undefined,
    });
  }
}

export class ConversationResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['chat'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['chat'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['chat'] })
  lastActivityAt: Date;

  @Swagger.ApiProperty({ type: UserResponse, isArray: true })
  @Expose({ groups: ['chat'] })
  users: UserChatResponse[];

  @Swagger.ApiProperty({ type: MessageResponse })
  @Expose({ groups: ['chat'] })
  lastMessage?: MessageResponse;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['chat'] })
  isForCommunity: boolean;

  @Swagger.ApiProperty({ type: 'object' })
  @Expose({ groups: ['chat'] })
  metadata: MetadataResponse;

  constructor(partial: Partial<ConversationResponse>) {
    Object.assign(this, partial);
  }

  static from(
    conversation: ConversationWithUsers,
    userId: string,
  ): ConversationResponse {
    return new ConversationResponse({
      id: conversation.id,
      createdAt: conversation.createdAt,
      lastActivityAt: conversation.lastActivityAt,
      isForCommunity: conversation.isForCommunity,
      users: conversation.users.map(UserChatResponse.fromDomain),
      metadata: MetadataResponse.from(conversation.metadata),
      lastMessage: conversation.lastMessage
        ? MessageResponse.from(conversation.lastMessage, userId)
        : undefined,
    });
  }
}
