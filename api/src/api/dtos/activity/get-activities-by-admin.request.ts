import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';
import { ActivityStatus } from 'src/core/models/activity.model';

export class GetActivitiesByAdminRequest extends PaginationDto {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  searchTitle?: string;

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  languageCode?: string;

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  languageLevel?: string;

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  status?: ActivityStatus;
}
