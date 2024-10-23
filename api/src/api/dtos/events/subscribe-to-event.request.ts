import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class SubscribeToEventRequest {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  profilesIds: string[];
}
