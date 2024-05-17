import * as Swagger from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class PaginationRequest {
    @Swagger.ApiProperty({ required: false, default: 30 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    readonly limit: number = 30;

    @Swagger.ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    readonly offset: number = 0;
}
