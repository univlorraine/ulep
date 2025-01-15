import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ActivityStatus } from 'src/core/models/activity.model';

export class UpdateActivityStatusRequest {
  @ApiProperty({ type: 'string', enum: ActivityStatus })
  @IsNotEmpty()
  status: ActivityStatus;
}
