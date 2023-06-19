import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { User } from 'src/core/models/user';

export class UserRead {
  @ApiProperty({ readOnly: true })
  id: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ uniqueItems: true, example: 'mail@example.com' })
  email: string;

  static fromDomain(instance: User): UserRead {
    return { id: instance.getId(), email: instance.getEmail() };
  }
}

export class UserCreate {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ uniqueItems: true, example: 'mail@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  password: string;
}

export class ResetPasswordRequest {
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
