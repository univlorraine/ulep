import * as Swagger from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteContactConversationRequest {
    @Swagger.ApiProperty({ type: 'string', isArray: true })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    chatIdsToIgnore: string[];
}
