import { ApiProperty } from '@nestjs/swagger';
import { UniversityDto } from './university.dto';
import { Image } from './image.dto';

export class Profile {
  @ApiProperty({ readOnly: true })
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty({ type: UniversityDto })
  organization: UniversityDto;

  @ApiProperty({ type: Image, readOnly: true })
  avatar?: Image;
}
