import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ResetPasswordRequest {
  @ApiProperty({ description: 'The user id.' })
  @IsUUID()
  user: string;

  @ApiPropertyOptional({ description: 'The redirect uri.' })
  @IsString()
  @IsOptional()
  redirectUri?: string;
}
