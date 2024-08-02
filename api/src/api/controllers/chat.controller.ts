import { Collection } from '@app/common';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { AuthenticationGuard } from '../guards';

import {
  ConversationResponse,
  GetConversationRequest,
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
  @SerializeOptions({ groups: ['chat'] })
  @Swagger.ApiOperation({ summary: 'Get all conversations for user id.' })
  @Swagger.ApiOkResponse({ type: ConversationResponse, isArray: true })
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

  @Get('messages/:id')
  @SerializeOptions({ groups: ['chat'] })
  @Swagger.ApiOperation({ summary: 'Get messages from a conversation.' })
  @Swagger.ApiOkResponse({ type: MessageResponse, isArray: true })
  @UseGuards(AuthenticationGuard)
  async getMessagesFromConversation(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() params: GetMessagesQueryParams,
  ) {
    const messages = await this.getMessagesFromConversationUsecase.execute({
      conversationId: id,
      limit: params.limit,
      lastMessageId: params.lastMessageId,
      contentFilter: params.contentFilter,
      typeFilter: params.typeFilter,
    });

    return new Collection<MessageResponse>({
      items: messages.map(MessageResponse.from),
      totalItems: messages.length,
    });
  }

  @Post('generate-conversation')
  @SerializeOptions({ groups: ['chat'] })
  @UseGuards(AuthenticationGuard)
  @Swagger.ApiOperation({
    summary: 'Generate all conversations for all tandems.',
  })
  @UseGuards(AuthenticationGuard)
  async generateAllMissingConversations() {
    await this.generateConversationsUsecase.execute();
  }
}
