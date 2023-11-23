import * as Swagger from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class GetAdministratorsQueryParams {
  @Swagger.ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  universityId?: string;
}
