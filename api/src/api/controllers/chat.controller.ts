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

import { Collection, ModeQuery } from '@app/common';
import {
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { AuthenticationGuard } from '../guards';

import { KeycloakUser } from '@app/keycloak';
import { CurrentUser } from 'src/api/decorators';
import {
  ConversationResponse,
  GetConversationQuery,
  GetMessagesQueryParams,
  MessageResponse,
} from 'src/api/dtos/chat';
import {
  GenerateConversationsUsecase,
  GetAllConversationsFromUserIdUsecase,
  GetMessagesFromConversationUsecase,
} from 'src/core/usecases/chat';
@Controller('chat')
@Swagger.ApiTags('Chat')
export class ChatController {
  constructor(
    private readonly generateConversationsUsecase: GenerateConversationsUsecase,
    private readonly getAllConversationsFromUserIdUsecase: GetAllConversationsFromUserIdUsecase,
    private readonly getMessagesFromConversationUsecase: GetMessagesFromConversationUsecase,
  ) {}

  @Get(':id')
  @SerializeOptions({ groups: ['chat', 'read'] })
  @Swagger.ApiOperation({ summary: 'Get all conversations for user id.' })
  @Swagger.ApiOkResponse({ type: ConversationResponse, isArray: true })
  @UseGuards(AuthenticationGuard)
  async getAllConversations(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: KeycloakUser,
    @Query() params: GetConversationQuery,
  ): Promise<Collection<ConversationResponse>> {
    const conversations =
      await this.getAllConversationsFromUserIdUsecase.execute({
        userId: id,
        limit: params.limit,
        offset: (params.page - 1) * params.limit,
        filters: {
          user: {
            firstname: {
              contains: params.firstname,
              mode: ModeQuery.INSENSITIVE,
            },
            lastname: {
              contains: params.lastname,
              mode: ModeQuery.INSENSITIVE,
            },
          },
        },
      });

    return new Collection<ConversationResponse>({
      items: conversations.items.map((conversation) =>
        ConversationResponse.from(conversation, user.sub),
      ),
      totalItems: conversations.totalItems,
    });
  }

  @Get('messages/:id')
  @SerializeOptions({ groups: ['read'] })
  @Swagger.ApiOperation({ summary: 'Get messages from a conversation.' })
  @Swagger.ApiOkResponse({ type: MessageResponse, isArray: true })
  @UseGuards(AuthenticationGuard)
  async getMessagesFromConversation(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: KeycloakUser,
    @Query() params: GetMessagesQueryParams,
    @Headers('Language-code') languageCode?: string,
  ) {
    const messages = await this.getMessagesFromConversationUsecase.execute({
      conversationId: id,
      limit: params.limit,
      lastMessageId: params.lastMessageId,
      hashtagFilter: params.hashtagFilter,
      typeFilter: params.typeFilter,
      direction: params.direction,
      parentId: params.parentId,
    });

    return new Collection<MessageResponse>({
      items: messages.map((message) =>
        MessageResponse.from(message, user.sub, languageCode),
      ),
      totalItems: messages.length,
    });
  }

  @Post('generate-conversation')
  @SerializeOptions({ groups: ['read'] })
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Generate all conversations for all tandems.',
  })
  @UseGuards(AuthenticationGuard)
  async generateAllMissingConversations() {
    await this.generateConversationsUsecase.execute();
  }
}
