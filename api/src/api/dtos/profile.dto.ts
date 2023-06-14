import { ApiProperty } from '@nestjs/swagger';
import { UniversityRead } from './university.dto';
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

  @ApiProperty({ type: UniversityRead })
  organization: UniversityRead;

  @ApiProperty({ type: Image, readOnly: true })
  avatar?: Image;
}
