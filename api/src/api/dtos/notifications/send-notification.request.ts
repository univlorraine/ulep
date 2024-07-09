import { IsArray, IsString } from 'class-validator';

export class SendNotificationRequest {
  @IsString()
  senderId: string;

  @IsString()
  content: string;

  @IsArray()
  usersId: string[];
}
