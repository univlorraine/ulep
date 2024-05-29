import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { CreateConversationRequest } from 'src/api/dtos/conversation';
import { ConversationResponse } from 'src/api/dtos/conversation/conversation.response';
import { MessageResponse, SendMessageRequest } from 'src/api/dtos/message';
import { CollectionResponse } from 'src/api/dtos/pagination';
import { AuthenticationGuard } from 'src/api/guards';
import { MediaObject } from 'src/core/models/media.model';
import { CreateMessageUsecase, UploadMediaUsecase } from 'src/core/usecases';
import { CreateConversationUsecase } from 'src/core/usecases/conversation/create-conversation.usecase';
import { DeleteConversationUsecase } from 'src/core/usecases/conversation/delete-conversation.usecase';
import { GetConversationFromUserIdUsecase } from 'src/core/usecases/conversation/get-conversation-from-user-id.usecase';

@Controller('conversations')
@Swagger.ApiTags('Conversations')
export class ConversationController {
    constructor(
        private createMessageUsecase: CreateMessageUsecase,
        private createConversationUsecase: CreateConversationUsecase,
        private deleteConversationUsecase: DeleteConversationUsecase,
        private getConversationFromUserIdUsecase: GetConversationFromUserIdUsecase,
        private uploadMediaUsecase: UploadMediaUsecase,
    ) {}

    @Get('/:id')
    @UseGuards(AuthenticationGuard)
    @Swagger.ApiOperation({ summary: 'Get all conversations from id' })
    async getConversations(
        @Param('id') conversationId: string,
    ): Promise<CollectionResponse<ConversationResponse>> {
        const conversations =
            await this.getConversationFromUserIdUsecase.execute({
                id: conversationId,
            });

        return new CollectionResponse<ConversationResponse>({
            items: conversations.map(ConversationResponse.from),
            totalItems: conversations.length,
        });
    }

    @Post('/')
    @UseGuards(AuthenticationGuard)
    @Swagger.ApiOperation({ summary: 'Create a conversation' })
    async createConversation(
        @Body() body: CreateConversationRequest,
    ): Promise<ConversationResponse> {
        const conversation = await this.createConversationUsecase.execute({
            userIds: body.userIds,
            metadata: body.metadata,
        });
        return ConversationResponse.from(conversation);
    }

    @Delete('/:id')
    @UseGuards(AuthenticationGuard)
    @Swagger.ApiOperation({ summary: 'Delete a conversation' })
    async deleteConversation(
        @Param('id') conversationId: string,
    ): Promise<void> {
        await this.deleteConversationUsecase.execute({ id: conversationId });
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
            ownerName: body.senderName,
            ownerImage: body.senderImage,
            mimetype: file?.mimetype,
        });

        let media: MediaObject;
        if (file) {
            media = await this.uploadMediaUsecase.execute({
                file,
                messageId: message.id,
                conversationId,
            });
        }

        return MessageResponse.from(message, media);
    }
}
