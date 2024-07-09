import * as Swagger from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'src/api/dtos/pagination';

export class GetConversationRequest extends PaginationRequest {
    @Swagger.ApiProperty({ type: 'string', format: 'uuid', required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    userId: string;
}
