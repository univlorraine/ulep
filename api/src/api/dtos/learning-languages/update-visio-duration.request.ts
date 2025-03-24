import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateVisioDurationRequest {
  @IsString()
  @IsNotEmpty()
  partnerTandemId: string;

  @IsString()
  @IsNotEmpty()
  partnerFirstname: string;

  @IsString()
  @IsNotEmpty()
  partnerLastname: string;

  @IsString()
  @IsNotEmpty()
  roomName: string;
}
