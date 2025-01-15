import * as Swagger from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddUserToConversationRequest {
    @Swagger.ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    userId: string;
}
