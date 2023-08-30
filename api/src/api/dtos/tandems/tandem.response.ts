import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Tandem, TandemStatus } from '../../../core/models/tandem.model';
import { ProfileResponse } from '../profiles';
import { LanguageResponse } from '../languages';

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

export class UserTandemResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose({ groups: ['read'] })
  id: string | null = null;

  @Swagger.ApiProperty({ type: ProfileResponse })
  @Expose({ groups: ['read'] })
  partner: ProfileResponse;

  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @Expose({ groups: ['read'] })
  status: TandemStatus;

  @Swagger.ApiProperty({ type: LanguageResponse, isArray: true })
  @Expose({ groups: ['read'] })
  languages: LanguageResponse[];

  constructor(partial: Partial<UserTandemResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(profileId: string, tandem: Tandem): UserTandemResponse {
    const partner = tandem.profiles.find((p) => p.id !== profileId);

    if (!partner) {
      throw new Error('Partner not found');
    }

    return new UserTandemResponse({
      id: tandem.id,
      partner: ProfileResponse.fromDomain(partner),
      status: tandem.status,
      languages: tandem.profiles.map((p) =>
        LanguageResponse.fromLanguage(p.nativeLanguage),
      ),
    });
  }
}
