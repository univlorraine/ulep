import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ResetPasswordCommand } from 'src/core/usecases/users/reset-password.usecase';

export class ResetPasswordRequest implements ResetPasswordCommand {
  @ApiProperty({ description: 'The user id.' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ description: 'The redirect uri.' })
  @IsString()
  @IsOptional()
  redirectUri?: string;
}
