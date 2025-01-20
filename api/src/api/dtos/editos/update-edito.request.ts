import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { EditoTranslation } from 'src/core/models/edito.model';

export class UpdateEditoRequest {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  languageCode: string;

  @ApiProperty()
  @IsArray()
  translations: EditoTranslation[];
}
