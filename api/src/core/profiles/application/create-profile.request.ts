import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateProfileRequest {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
}
