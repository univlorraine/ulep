import { IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'src/api/dtos/pagination';

export class GetMessagesQueryParams extends PaginationRequest {
    @IsString()
    @IsOptional()
    messageFilter?: string;
}
