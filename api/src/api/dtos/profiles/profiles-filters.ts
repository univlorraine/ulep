import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination';
import { SortOrder } from '@app/common';
import { ProfileQuerySortKey } from 'src/core/ports/profile.repository';
import { UserStatus } from 'src/core/models';

class ProfileQueryWhere {
  user: {
    country?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    role?: string;
    status?: UserStatus;
    university?: UserStatus;
  };
  masteredLanguageCode?: string;
  nativeLanguageCode?: string;
}

export class ProfileQueryFilter extends PaginationDto {
  @ApiPropertyOptional({
    type: 'string',
    enum: ['email', 'firstname', 'lastname', 'role', 'university'],
  })
  @IsOptional()
  field?: ProfileQuerySortKey;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  where: ProfileQueryWhere;
}
