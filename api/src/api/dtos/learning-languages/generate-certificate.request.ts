import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsOptional } from 'class-validator';

export class GenerateCertificateRequest {
  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @IsOptional()
  learningJournal?: boolean;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @IsOptional()
  consultingInterview?: boolean;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @IsOptional()
  sharedCertificate?: boolean;
}
