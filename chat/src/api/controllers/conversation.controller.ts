import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import {
    CreateConversationRequest,
    GetMessagesQueryParams,
} from 'src/api/dtos/conversation';
import { ConversationResponse } from 'src/api/dtos/conversation/conversation.response';
import { CreateConversationsRequest } from 'src/api/dtos/conversation/create-conversations.request';
import { MessageResponse, SendMessageRequest } from 'src/api/dtos/message';
import { CollectionResponse } from 'src/api/dtos/pagination';
import { AuthenticationGuard } from 'src/api/guards';
import {
    CreateConversationUsecase,
    CreateMessageUsecase,
    CreateMultipleConversationsUsecase,
    DeleteContactConversationUsecase,
    DeleteConversationUsecase,
    DeleteUserConversationUsecase,
    GetConversationFromUserIdUsecase,
    GetMessagesFromConversationIdUsecase,
    UploadMediaUsecase,
} from 'src/core/usecases';

//TODO: Allow route only for rest api
@Controller('conversations')
@Swagger.ApiTags('Conversations')
export class ConversationController {
    constructor(
        private createMessageUsecase: CreateMessageUsecase,
        private createMultipleConversationsUsecase: CreateMultipleConversationsUsecase,
        private createConversationUsecase: CreateConversationUsecase,
        private deleteConversationUsecase: DeleteConversationUsecase,
        private deleteContactConversationUsecase: DeleteContactConversationUsecase,
        private deleteUserConversationUsecase: DeleteUserConversationUsecase,
        private getMessagesFromConversationIdUsecase: GetMessagesFromConversationIdUsecase,
        private getConversationFromUserIdUsecase: GetConversationFromUserIdUsecase,
        private uploadMediaUsecase: UploadMediaUsecase,
    ) {}

    @Get('messages/:id')
    @Swagger.ApiOperation({ summary: 'Get all messages from conversation id' })
    async getConversations(
        @Param('id') conversationId: string,
        @Query() params: GetMessagesQueryParams,
    ): Promise<CollectionResponse<MessageResponse>> {
        const messages =
            await this.getMessagesFromConversationIdUsecase.execute({
                id: conversationId,
                pagination: {
                    lastMessageId: params.lastMessageId,
                    limit: params.limit,
                },
                filter: params.messageFilter,
            });

        return new CollectionResponse<MessageResponse>({
            items: messages.map(MessageResponse.from),
            totalItems: messages.length,
        });
    }

    @Get('/:id')
    @Swagger.ApiOperation({ summary: 'Get all conversations from id' })
    async getConversationsFromUserId(
        @Param('id') userId: string,
    ): Promise<CollectionResponse<ConversationResponse>> {
        const conversations =
            await this.getConversationFromUserIdUsecase.execute({
                id: userId,
            });

        return new CollectionResponse<ConversationResponse>({
            items: conversations.map(ConversationResponse.from),
            totalItems: conversations.length,
        });
    }

    @Post('/')
    @Swagger.ApiOperation({ summary: 'Create a conversation' })
    async createConversation(
        @Body() body: CreateConversationRequest,
    ): Promise<ConversationResponse> {
        const conversation = await this.createConversationUsecase.execute({
            userIds: body.userIds,
            tandemId: body.tandemId,
            metadata: body.metadata,
        });
        return ConversationResponse.from(conversation);
    }

    @Post('/multi')
    @Swagger.ApiOperation({ summary: 'Create some conversations' })
    async createConversations(
        @Body() body: CreateConversationsRequest,
    ): Promise<void> {
        await this.createMultipleConversationsUsecase.execute({
            conversations: body.conversations,
        });
    }

    @Delete('/:id')
    @Swagger.ApiOperation({ summary: 'Delete a conversation' })
    async deleteConversation(
        @Param('id') conversationId: string,
    ): Promise<void> {
        await this.deleteConversationUsecase.execute({ id: conversationId });
    }

    @Delete('contact/:id')
    @Swagger.ApiOperation({ summary: 'Delete a conversation' })
    async deleteContactConversation(
        @Param('id') conversationId: string,
    ): Promise<void> {
        await this.deleteContactConversationUsecase.execute({
            id: conversationId,
        });
    }

    @Delete('user/:id')
    @Swagger.ApiOperation({ summary: 'Delete a conversation' })
    async deleteUserConversation(
        @Param('id') conversationId: string,
    ): Promise<void> {
        await this.deleteUserConversationUsecase.execute({
            id: conversationId,
        });
    }

    @Post('/:id/message')
    @UseGuards(AuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Swagger.ApiOperation({ summary: 'Send a message' })
    async sendMessage(
        @Param('id') conversationId: string,
        @Body() body: SendMessageRequest,
        @UploadedFile() file?: Express.Multer.File,
    ): Promise<MessageResponse | undefined> {
        const message = await this.createMessageUsecase.execute({
            content: body.content,
            conversationId,
            ownerId: body.senderId,
            mimetype: file?.mimetype,
            originalFilename: body.filename,
        });

        if (file && body.filename) {
            //TODO: Upload lighter image then heavier image
            const url = await this.uploadMediaUsecase.execute({
                file,
                message,
                conversationId,
                filename: body.filename,
            });
            message.content = url;
        }

        return MessageResponse.from(message);
    }
}
