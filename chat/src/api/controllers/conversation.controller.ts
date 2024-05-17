import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { ConversationResponse } from 'src/api/dtos/conversation/conversation.response';
import { GetConversationRequest } from 'src/api/dtos/conversation/getConversations.request';
import { CollectionResponse } from 'src/api/dtos/pagination';
import { AuthenticationGuard } from 'src/api/guards';

@Controller('conversations')
@Swagger.ApiTags('Conversations')
export class ConversationController {
    constructor() {}

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
}
