import { ApiProperty } from '@nestjs/swagger';

export class UploadResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;
}
