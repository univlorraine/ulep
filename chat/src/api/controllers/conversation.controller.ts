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
    DeleteContactConversationRequest,
    GetConversationsQueryParams,
    GetMessagesQueryParams,
} from 'src/api/dtos/conversation';
import { ConversationResponse } from 'src/api/dtos/conversation/conversation.response';
import { CreateConversationsRequest } from 'src/api/dtos/conversation/create-conversations.request';
import { MessageResponse, SendMessageRequest } from 'src/api/dtos/message';
import { CollectionResponse } from 'src/api/dtos/pagination';
import { AuthenticationGuard } from 'src/api/guards';
import { MessagePaginationDirection } from 'src/core/ports/message.repository';
import {
    CreateConversationUsecase,
    CreateMessageUsecase,
    CreateMultipleConversationsUsecase,
    DeleteContactConversationUsecase,
    DeleteConversationUsecase,
    DeleteUserConversationUsecase,
    ExportMediasFromConversationUsecase,
    GetConversationFromUserIdUsecase,
    GetMessagesFromConversationIdUsecase,
    SearchMessagesIdFromConversationIdUsecase,
    UploadMediaUsecase,
} from 'src/core/usecases';
import { FilePipe } from '../validators/files.validator';

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
        private searchMessagesIdFromConversationIdUsecase: SearchMessagesIdFromConversationIdUsecase,
        private uploadMediaUsecase: UploadMediaUsecase,
        private exportMediasFromConversationUsecase: ExportMediasFromConversationUsecase,
    ) {}

    @Get('messages/:id')
    @Swagger.ApiOperation({ summary: 'Get all messages from conversation id' })
    async getMessagesByConversationId(
        @Param('id') conversationId: string,
        @Query() params: GetMessagesQueryParams,
    ): Promise<CollectionResponse<MessageResponse>> {
        const messages =
            await this.getMessagesFromConversationIdUsecase.execute({
                id: conversationId,
                pagination: {
                    lastMessageId: params.lastMessageId,
                    limit: params.limit,
                    direction:
                        params.direction ?? MessagePaginationDirection.FORWARD,
                },
                contentFilter: params.contentFilter,
                typeFilter: params.typeFilter,
            });

        return new CollectionResponse<MessageResponse>({
            items: messages.map(MessageResponse.from),
            totalItems: messages.length,
        });
    }

    @Get('messages/:id/:search')
    @Swagger.ApiOperation({
        summary: 'Search all messages ids from conversation id',
    })
    async searchMessages(
        @Param('id') conversationId: string,
        @Param('search') search: string,
    ): Promise<string[]> {
        const messagesIds =
            await this.searchMessagesIdFromConversationIdUsecase.execute({
                id: conversationId,
                search: search,
            });

        return messagesIds;
    }

    @Get('/:id')
    @Swagger.ApiOperation({ summary: 'Get all conversations from id' })
    async getConversationsFromUserId(
        @Param('id') userId: string,
        @Query() query: GetConversationsQueryParams,
    ): Promise<CollectionResponse<ConversationResponse>> {
        const conversations =
            await this.getConversationFromUserIdUsecase.execute({
                id: userId,
                pagination: {
                    limit: query.limit ?? 50,
                    offset: query.offset ?? 0,
                },
                filteredProfilesIds: query.filteredProfilesIds,
            });

        return new CollectionResponse<ConversationResponse>({
            items: conversations.items.map(ConversationResponse.from),
            totalItems: conversations.totalItems,
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

    @Post('contact/:id')
    @Swagger.ApiOperation({ summary: 'Delete a conversation' })
    async deleteContactConversation(
        @Param('id') conversationId: string,
        @Body() body: DeleteContactConversationRequest,
    ): Promise<void> {
        await this.deleteContactConversationUsecase.execute({
            id: conversationId,
            chatIdsToIgnore: body.chatIdsToIgnore,
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
        @UploadedFile(new FilePipe()) file?: Express.Multer.File,
    ): Promise<MessageResponse | undefined> {
        const message = await this.createMessageUsecase.execute({
            content: body.content,
            conversationId,
            ownerId: body.senderId,
            mimetype: file?.mimetype,
            originalFilename: body.filename,
        });

        if (file && body.filename) {
            const { name, url, thumbnailUrl } =
                await this.uploadMediaUsecase.execute({
                    file,
                    message,
                    conversationId,
                    filename: body.filename,
                });
            message.content = url;
            message.metadata.thumbnail = thumbnailUrl;
            message.metadata.filePath = name;
        }

        return MessageResponse.from(message);
    }

    @Get('/:id/export/medias')
    @Swagger.ApiOperation({ summary: 'Export all medias from conversation id' })
    async exportMediasFromConversationId(
        @Param('id') conversationId: string,
    ): Promise<void> {
        await this.exportMediasFromConversationUsecase.execute({
            id: conversationId,
        });
    }
}
