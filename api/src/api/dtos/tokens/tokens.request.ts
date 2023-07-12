import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class TokensRequest {
  @ApiProperty({ type: 'string', format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: 'string', format: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
