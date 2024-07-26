import * as Swagger from '@nestjs/swagger';
import { PaginationRequest } from 'src/api/dtos/pagination';
import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetConversationsQueryParams {
    @Swagger.ApiProperty({ required: false, default: 30 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    readonly limit?: number = 30;

    @Swagger.ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    readonly offset?: number;

    @Swagger.ApiProperty({ type: String, required: false })
    @IsOptional()
    firstname?: string;

    @Swagger.ApiProperty({ type: String, required: false })
    @IsOptional()
    lastname?: string;

    @Swagger.ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    filteredProfilesIds?: string[];
}
