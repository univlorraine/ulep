import * as Swagger from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConversationRequest {
    @Swagger.ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    tandemId: string;

    @Swagger.ApiProperty({ type: 'string', isArray: true })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    userIds: string[];

    @Swagger.ApiProperty({ type: 'any' })
    @IsOptional()
    metadata: any;
}
