import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { PaginationDto } from '../pagination.dto';

export class ProfileQueryFilter extends PaginationDto {
  @ApiPropertyOptional({ type: 'string', format: 'email' })
  @IsEmail()
  @IsOptional()
  email: string;
}
