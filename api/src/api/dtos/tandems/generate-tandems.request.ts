import * as Swagger from '@nestjs/swagger';
import { ArrayNotEmpty, IsEnum } from 'class-validator';
import { TandemStatus } from 'src/core/models/tandem.model';
import { GenerateTandemsCommand } from 'src/core/usecases';

export class GenerateTandemsRequest implements GenerateTandemsCommand {
  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @ArrayNotEmpty()
  universityIds: string[];
}

export class UpdateTandemRequest {
  @Swagger.ApiProperty({ type: 'string', enum: ['active', 'inactive'] })
  @IsEnum(TandemStatus)
  status: TandemStatus;
}
