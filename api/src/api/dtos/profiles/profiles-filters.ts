import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination';
import { SortOrder } from '@app/common';

export type ProfileQuerySortKey = 'email' | 'firstname' | 'lastname' | 'role';
export class ProfileQueryFilter extends PaginationDto {
  @ApiPropertyOptional({ type: 'string', format: 'email' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  field?: ProfileQuerySortKey;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
