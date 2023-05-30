import { IsEmail, IsString, IsDate } from 'class-validator';

export class CreateProfileDto {
  @IsEmail()
  email: string;

  @IsString()
  gender: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDate()
  birthday: Date;
}
