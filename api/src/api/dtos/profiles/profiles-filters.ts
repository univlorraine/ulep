import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination';
import { SortOrder } from '@app/common';

export type ProfileQuerySortKey =
  | 'email'
  | 'firstname'
  | 'lastname'
  | 'role'
  | 'university';

class ProfileQueryWhere {
  user: {
    country?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    role?: string;
    university?: string;
  };
  masteredLanguageCode?: string;
  nativeLanguageCode?: string;
}

export class ProfileQueryFilter extends PaginationDto {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  field?: ProfileQuerySortKey;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  where: ProfileQueryWhere;
}
