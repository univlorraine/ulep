import * as Swagger from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteUserConversationRequest {
    @Swagger.ApiProperty({ type: 'string', isArray: true })
    @IsString({ each: true })
    chatIdsToIgnore: string[];

    @Swagger.ApiProperty({ type: 'string', isArray: true })
    @IsString({ each: true })
    chatIdsToLeave: string[];
}
