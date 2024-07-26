import * as Swagger from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';

export class GetConversationQuery extends PaginationDto {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  firstname?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  lastname?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  university?: string;
}
