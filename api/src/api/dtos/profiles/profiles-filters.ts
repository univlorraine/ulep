import { SortOrder } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserStatus } from 'src/core/models';
import { ProfileQuerySortKey } from 'src/core/ports/profile.repository';
import { PaginationDto } from '../pagination';

export class ProfileQueryFilter extends PaginationDto {
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  firstname?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  lastname?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  university?: string;

  @ApiPropertyOptional({ type: 'uuid' })
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  status?: UserStatus;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  masteredLanguageCode?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  nativeLanguageCode?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  notSubscribedToEvent?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  subscribedToEvent?: string;

  @ApiPropertyOptional({
    type: 'string',
    enum: ['email', 'firstname', 'lastname', 'role', 'university'],
  })
  @IsOptional()
  field?: ProfileQuerySortKey;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
