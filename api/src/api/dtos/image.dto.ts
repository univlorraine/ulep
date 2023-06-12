import { ApiProperty } from '@nestjs/swagger';

export class Image {
  @ApiProperty({ readOnly: true })
  id: string;

  @ApiProperty()
  url: string;
}
