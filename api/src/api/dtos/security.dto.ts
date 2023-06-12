import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @ApiProperty({
    description:
      'Contains at least one digit OR at least one special character, one uppercase letter and one lowercase letter.',
  })
  password: string;
}

export class RefreshTokenRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;
}

export class LoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
