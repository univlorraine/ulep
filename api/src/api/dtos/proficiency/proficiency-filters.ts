import * as Swagger from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';
import { ProficiencyLevel } from 'src/core/models';

export class GetProficiencyQueryParams extends PaginationDto {
  @Swagger.ApiPropertyOptional({ type: 'string', enum: ProficiencyLevel })
  @IsOptional()
  quizzLevel?: ProficiencyLevel;
}
