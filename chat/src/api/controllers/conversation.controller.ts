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
import { ConversationResponse } from 'src/api/dtos/conversation/conversation.response';
import { GetConversationRequest } from 'src/api/dtos/conversation/getConversations.request';
import { SendMessageRequest } from 'src/api/dtos/message';
import { CollectionResponse } from 'src/api/dtos/pagination';
import { AuthenticationGuard } from 'src/api/guards';
import { CreateMessageUsecase, UploadMediaUsecase } from 'src/core/usecases';
import { CreateConversationUsecase } from 'src/core/usecases/conversation/create-conversation.usecase';
import { DeleteConversationUsecase } from 'src/core/usecases/conversation/delete-conversation.usecase';

@Controller('conversations')
@Swagger.ApiTags('Conversations')
export class ConversationController {
    constructor(
        private createMessageUsecase: CreateMessageUsecase,
        private createConversationUsecase: CreateConversationUsecase,
        private deleteConversationUsecase: DeleteConversationUsecase,
        private uploadMediaUsecase: UploadMediaUsecase,
    ) {}

    @Get('/')
    @UseGuards(AuthenticationGuard)
    @Swagger.ApiOperation({ summary: 'Get all conversations' })
    async getConversations(
        @Query() filters: GetConversationRequest,
    ): Promise<CollectionResponse<ConversationResponse>> {
        return new CollectionResponse<ConversationResponse>({
            items: [],
            totalItems: 0,
        });
    }

    @Post('/')
    @UseGuards(AuthenticationGuard)
    @Swagger.ApiOperation({ summary: 'Create a conversation' })
    async createConversation(
        @Query() filters: GetConversationRequest,
    ): Promise<CollectionResponse<ConversationResponse>> {
        return new CollectionResponse<ConversationResponse>({
            items: [],
            totalItems: 0,
        });
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
    ): Promise<string | undefined> {
        const message = await this.createMessageUsecase.execute({
            content: body.content,
            conversationId,
            ownerId: body.senderId,
            ownerName: body.senderName,
            ownerImage: body.senderImage,
            mimetype: file?.mimetype,
        });

        if (file) {
            const media = await this.uploadMediaUsecase.execute({
                file,
                messageId: message.id,
                conversationId,
            });
        }

        return;
    }
}
