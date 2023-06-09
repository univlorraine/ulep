import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.dto';
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

  @ApiProperty({ type: Organization })
  organization: Organization;

  @ApiProperty({ type: Image, readOnly: true })
  avatar?: Image;
}
