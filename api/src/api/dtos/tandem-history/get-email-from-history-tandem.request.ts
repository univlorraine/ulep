import * as Swagger from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetOtherUserEmailInTandemRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  languageId: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  userId: string;
}
