import * as Swagger from '@nestjs/swagger';
import { ArrayNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { TandemStatus } from 'src/core/models/tandem.model';
import { GenerateTandemsCommand } from 'src/core/usecases';

export class GenerateTandemsRequest implements GenerateTandemsCommand {
  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  universityIds: string[];
}

export class UpdateTandemRequest {
  @Swagger.ApiProperty({ type: 'string', enum: ['active', 'inactive'] })
  @IsEnum(TandemStatus)
  status: TandemStatus;
}
