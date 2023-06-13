import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination.dto';

export class GetUsersPaginationDto extends PaginationDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly email?: string;
}
