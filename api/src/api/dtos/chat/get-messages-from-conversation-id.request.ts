import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/api/dtos/pagination';
import { ChatPaginationDirection } from 'src/core/ports/chat.service';

export class GetMessagesQueryParams extends PaginationDto {
  @IsString()
  @IsOptional()
  hashtagFilter: string;

  @IsString()
  @IsOptional()
  typeFilter: string;

  @IsString()
  @IsOptional()
  lastMessageId: string;

  @IsString()
  @IsOptional()
  direction: ChatPaginationDirection;

  @IsString()
  @IsOptional()
  parentId: string;
}
