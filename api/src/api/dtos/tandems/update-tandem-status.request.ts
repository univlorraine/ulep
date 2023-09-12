import * as Swagger from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TandemStatus } from 'src/core/models/tandem.model';

export class UpdateTandemStatusRequest {
  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @IsEnum(TandemStatus)
  status: TandemStatus;
}
