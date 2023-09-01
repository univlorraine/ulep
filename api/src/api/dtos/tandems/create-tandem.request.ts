import * as Swagger from '@nestjs/swagger';
import { ArrayNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { TandemStatus } from 'src/core/models/tandem.model';
import { CreateTandemCommand } from 'src/core/usecases/tandem/create-tandem.usecase';

export class CreateTandemRequest implements CreateTandemCommand {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @ArrayNotEmpty()
  learningLanguages: string[];

  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @IsEnum(TandemStatus)
  status: TandemStatus;
}

export class UpdateTandemRequest {
  @Swagger.ApiProperty({ type: 'string', enum: ['active', 'inactive'] })
  @IsEnum(TandemStatus)
  status: TandemStatus;
}
