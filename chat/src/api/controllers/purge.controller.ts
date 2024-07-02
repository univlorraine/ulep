import { Controller, Post } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { PurgeChatUsecase } from 'src/core/usecases/purge/purge-chat.usecase';

@Controller('purge')
@Swagger.ApiTags('Purge')
export class PurgeController {
    constructor(private purgeChatUsecase: PurgeChatUsecase) {}

    @Post()
    @Swagger.ApiOperation({ summary: 'Purge the chat' })
    async purge(): Promise<void> {
        await this.purgeChatUsecase.execute();
    }
}
