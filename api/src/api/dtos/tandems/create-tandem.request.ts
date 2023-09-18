import * as Swagger from '@nestjs/swagger';
import { ArrayNotEmpty } from 'class-validator';

export class CreateTandemRequest {
  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @ArrayNotEmpty()
  learningLanguageIds: string[];
}
