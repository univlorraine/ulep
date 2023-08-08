import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination';
import { SortOrder } from '@app/common';

export type ProfileQuerySortKey = 'firstname' | 'lastname';
export class ProfileQueryFilter extends PaginationDto {
  @ApiPropertyOptional({ type: 'string', format: 'email' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  sortKey: ProfileQuerySortKey;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  sortOrder: SortOrder;
}
