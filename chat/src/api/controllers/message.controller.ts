import {
    Body,
    Controller,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Swagger from '@nestjs/swagger';
import { SendMessageRequest } from 'src/api/dtos/message';
import { AuthenticationGuard } from 'src/api/guards';
import { CreateMessageUsecase, UploadMediaUsecase } from 'src/core/usecases';

@Controller('messages')
@Swagger.ApiTags('Messages')
export class MessageController {
    constructor(
        private createMessageUsecase: CreateMessageUsecase,
        private uploadMediaUsecase: UploadMediaUsecase,
    ) {}

    @Post('/')
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
