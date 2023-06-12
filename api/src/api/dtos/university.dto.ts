import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { University } from 'src/core/models/university';

export class UniversityDto {
  @ApiProperty({ readOnly: true })
  id: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  static fromDomain(instance: University): UniversityDto {
    return { id: instance.id, name: instance.name };
  }
}
