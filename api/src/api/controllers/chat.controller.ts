import { Collection } from '@app/common';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { AuthenticationGuard } from '../guards';

import { CampusResponse } from 'src/api/dtos/campus';
import {
  GetAllConversationsFromUserIdUsecase,
  GetMessagesFromConversationUsecase,
} from 'src/core/usecases/chat';
import {
  ConversationResponse,
  GetConversationRequest,
  GetMessagesQueryParams,
  MessageResponse,
} from 'src/api/dtos/chat';
@Controller('chat')
@Swagger.ApiTags('Chat')
export class ChatController {
  constructor(
    private readonly getAllConversationsFromUserIdUsecase: GetAllConversationsFromUserIdUsecase,
    private readonly getMessagesFromConversationUsecase: GetMessagesFromConversationUsecase,
  ) {}

  @Get(':id')
  @SerializeOptions({ groups: ['chat'] })
  @Swagger.ApiOperation({ summary: 'Get all conversations for user id.' })
  @Swagger.ApiOkResponse({ type: CampusResponse, isArray: true })
  @UseGuards(AuthenticationGuard)
  async getAllConversations(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() params: GetConversationRequest,
  ): Promise<Collection<ConversationResponse>> {
    const conversations =
      await this.getAllConversationsFromUserIdUsecase.execute({
        userId: id,
        limit: params.limit,
        offset: params.page,
      });

    return new Collection<ConversationResponse>({
      items: conversations.map(ConversationResponse.from),
      totalItems: conversations.length,
    });
  }

  //TODO: Handle last message ID
  @Get('messages/:id')
  @SerializeOptions({ groups: ['chat'] })
  @Swagger.ApiOperation({ summary: 'Get messages from a conversation.' })
  @Swagger.ApiOkResponse({ type: CampusResponse, isArray: true })
  @UseGuards(AuthenticationGuard)
  async getMessagesFromConversation(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() params: GetMessagesQueryParams,
  ) {
    const messages = await this.getMessagesFromConversationUsecase.execute({
      conversationId: id,
      limit: params.limit,
      offset: params.page,
      messageFilter: params.messageFilter,
    });

    return new Collection<MessageResponse>({
      items: messages.map(MessageResponse.from),
      totalItems: messages.length,
    });
  }
}
