import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayNotEmpty, IsIn } from 'class-validator';
import { Tandem } from 'src/core/models/tandem';

export class CreateTandemRequest {
  @ApiProperty({ type: 'string', isArray: true })
  @ArrayNotEmpty()
  profiles: string[];

  @ApiProperty({ type: 'string', enum: ['active', 'inactive'] })
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';
}

export class UpdateTandemRequest extends PartialType(CreateTandemRequest) {}

export class TandemResponse {
  @ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose({ groups: ['read'] })
  id: string | null = null;

  @ApiProperty({ type: 'string', format: 'uuid', isArray: true })
  @Expose({ groups: ['read'] })
  profiles: string[];

  @ApiProperty({ type: 'string', enum: ['active', 'inactive', 'draft'] })
  @Expose({ groups: ['read'] })
  status: string;

  @ApiProperty({ type: 'number', nullable: true })
  @Expose({ groups: ['read'] })
  score: number | null = null;

  constructor(partial: Partial<TandemResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(tandem: Tandem): TandemResponse {
    return new TandemResponse({
      id: tandem.id,
      profiles: tandem.profiles.map((profile) => profile.id),
      status: tandem.status,
    });
  }
}
