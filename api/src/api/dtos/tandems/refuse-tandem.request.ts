import * as Swagger from '@nestjs/swagger';
import { ArrayNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class RefuseTandemRequest {
  @Swagger.ApiProperty({ type: 'string', isArray: true, minItems: 2 })
  @ArrayNotEmpty()
  learningLanguageIds: string[];

  @Swagger.ApiProperty()
  @IsBoolean()
  @IsOptional()
  relaunch?: boolean;
}
