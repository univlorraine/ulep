import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';

export class GetMessagesQueryParams extends PaginationDto {
  @IsString()
  @IsOptional()
  messageFilter: string;
}
