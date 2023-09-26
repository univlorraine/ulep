import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class BearerTokensRequest {
  @ApiProperty({ type: 'string', format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: 'string', format: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenRequest {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class BearerTokensResponse {
  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  accessToken: string;

  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  refreshToken: string;

  constructor(partial: Partial<BearerTokensResponse>) {
    Object.assign(this, partial);
  }
}

export class ResetPasswordRequest {
  @ApiProperty({ description: 'The user email' })
  @IsString()
  email: string;
}
