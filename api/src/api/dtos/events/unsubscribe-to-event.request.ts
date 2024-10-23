import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UnsubscribeToEventRequest {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  profilesIds: string[];
}
