import * as Swagger from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { MessageType } from 'src/core/models';

export class GetMessagesQueryParams {
    @IsString()
    @IsOptional()
    contentFilter?: string;

    @IsString()
    @IsOptional()
    typeFilter?: MessageType;

    @Swagger.ApiProperty({ required: false, default: 30 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    readonly limit: number = 30;

    @Swagger.ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    readonly lastMessageId: string;
}
