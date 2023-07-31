import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Tandem, TandemStatus } from '../../../core/models/tandem.model';
import { ProfileResponse } from '../profiles';

export class TandemResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose({ groups: ['read'] })
  id: string | null = null;

  @Swagger.ApiProperty({ type: ProfileResponse, isArray: true })
  @Expose({ groups: ['read'] })
  profiles: ProfileResponse[];

  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @Expose({ groups: ['read'] })
  status: TandemStatus;

  @Swagger.ApiProperty({ type: 'number', nullable: true })
  @Expose({ groups: ['read'] })
  score: number | null = null;

  constructor(partial: Partial<TandemResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(tandem: Tandem): TandemResponse {
    return new TandemResponse({
      id: tandem.id,
      profiles: tandem.profiles.map(ProfileResponse.fromDomain),
      status: tandem.status,
    });
  }
}
