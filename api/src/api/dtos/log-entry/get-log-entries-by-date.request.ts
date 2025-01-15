import { IsDateString, IsNotEmpty } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';

export class GetLogEntriesByDateRequest extends PaginationDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
