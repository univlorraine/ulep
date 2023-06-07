import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;
}
