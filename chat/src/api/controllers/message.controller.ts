import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { MessageResponse } from 'src/api/dtos/message';
import { UpdateMessageRequest } from 'src/api/dtos/message/update-message.request';
import { UpdateMessageUsecase } from 'src/core/usecases';

@Controller('messages')
@Swagger.ApiTags('Messages')
export class MessageController {
    constructor(private updateMessageUsecase: UpdateMessageUsecase) {}

    @Put('/:id')
    @Swagger.ApiOperation({ summary: 'Update a message' })
    async updateMessage(
        @Param('id') messageId: string,
        @Body() command: UpdateMessageRequest,
    ): Promise<MessageResponse> {
        const message = await this.updateMessageUsecase.execute({
            messageId,
            isReported: command.isReported,
            content: command.content,
            isDeleted: command.isDeleted,
        });

        return MessageResponse.from(message);
    }
}
