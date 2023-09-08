import * as Swagger from '@nestjs/swagger';
import { ArrayNotEmpty, IsEnum } from 'class-validator';
import { TandemStatus } from 'src/core/models/tandem.model';
import { CreateTandemCommand } from 'src/core/usecases/tandem/create-tandem.usecase';

export class CreateTandemRequest implements CreateTandemCommand {
  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @ArrayNotEmpty()
  learningLanguageIds: string[];

  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @IsEnum(TandemStatus)
  status: TandemStatus;
}
