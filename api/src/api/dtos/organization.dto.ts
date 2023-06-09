import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Organization {
  @ApiProperty({ readOnly: true })
  id: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
