import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class Language {
  @ApiProperty({ readOnly: true })
  id: string;

  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsBoolean()
  @ApiProperty()
  enabled: boolean;
}
