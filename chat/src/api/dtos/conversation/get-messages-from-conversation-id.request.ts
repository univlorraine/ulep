import * as Swagger from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetMessagesQueryParams {
    @IsString()
    @IsOptional()
    messageFilter?: string;

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
