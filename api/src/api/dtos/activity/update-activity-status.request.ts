import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ActivityStatus } from 'src/core/models/activity.model';

export class UpdateActivityStatusRequest {
  @ApiProperty({ type: 'string', enum: ActivityStatus })
  @IsOptional()
  status?: ActivityStatus;
}
