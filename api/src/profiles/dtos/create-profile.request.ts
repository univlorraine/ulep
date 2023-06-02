import { IsEmail } from 'class-validator';

export class CreateProfileRequest {
  @IsEmail()
  email: string;
}
